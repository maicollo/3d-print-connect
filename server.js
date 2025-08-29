// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, initDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

app.use(cors());
app.use(express.json());

/* Utils */
function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token mancante o invalido' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, email, name }
    next();
  } catch {
    return res.status(401).json({ error: 'Token non valido o scaduto' });
  }
}

/* Health */
app.get('/', (req, res) => {
  res.json({ message: 'Backend 3D Print Connect in funzione!' });
});

/* AUTH */
// POST /api/auth/register
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password sono obbligatori' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'La password deve avere almeno 8 caratteri' });
  }

  const createdAt = new Date().toISOString();
  const passwordHash = bcrypt.hashSync(password, 12);

  const insert = `
    INSERT INTO users (name, email, passwordHash, createdAt)
    VALUES (?, ?, ?, ?)
  `;
  db.run(insert, [name, email.toLowerCase(), passwordHash, createdAt], function (err) {
    if (err) {
      if (String(err.message).includes('UNIQUE')) {
        return res.status(409).json({ error: 'Email già registrata' });
      }
      console.error('Errore registrazione:', err);
      return res.status(500).json({ error: 'Errore server durante la registrazione' });
    }
    const user = { id: this.lastID, name, email: email.toLowerCase() };
    const token = createToken(user);
    res.status(201).json({ user, token });
  });
});

// POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email e password sono obbligatori' });
  }

  const query = `SELECT id, name, email, passwordHash FROM users WHERE email = ? LIMIT 1`;
  db.get(query, [email.toLowerCase()], (err, row) => {
    if (err) {
      console.error('Errore login:', err);
      return res.status(500).json({ error: 'Errore server durante il login' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    const isValid = bcrypt.compareSync(password, row.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }
    const user = { id: row.id, name: row.name, email: row.email };
    const token = createToken(user);
    res.json({ user, token });
  });
});

// GET /api/me (profilo corrente)
app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

/* PROVIDERS (pubblico) */
app.get('/api/providers', (req, res) => {
  db.all('SELECT * FROM providers', [], (err, rows) => {
    if (err) {
      console.error('Errore nel recupero dei provider:', err);
      return res.status(500).json({ error: 'Errore nel recupero dei provider' });
    }
    const providers = rows.map(p => ({
      ...p,
      isBusiness: Boolean(p.isBusiness),
      printers: [],
      materials: [],
      orders: []
    }));
    res.json(providers);
  });
});

/* ORDERS (protetto) */
app.post('/api/orders', authMiddleware, (req, res) => {
  const {
    fileName,
    ideaDescription,
    material,
    quantity,
    providerId
  } = req.body || {};

  if (!material || !quantity || !providerId) {
    return res.status(400).json({ error: 'material, quantity e providerId sono obbligatori' });
  }

  const status = 'In attesa';
  const date = new Date().toISOString().split('T')[0];
  const customerName = req.user.name; // prendiamo dal token
  const userId = req.user.id;

  const query = `
    INSERT INTO orders (customerName, fileName, ideaDescription, material, quantity, status, date, providerId, userId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [customerName, fileName || null, ideaDescription || null, material, quantity, status, date, providerId, userId],
    function (err) {
      if (err) {
        console.error('Errore durante l\'inserimento dell\'ordine:', err);
        return res.status(500).json({ error: 'Errore durante la creazione dell\'ordine' });
      }
      res.status(201).json({
        id: this.lastID,
        customerName,
        fileName: fileName || null,
        ideaDescription: ideaDescription || null,
        material,
        quantity,
        status,
        date,
        providerId,
        userId
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server attivo su http://localhost:${PORT}`);
  initDb();
});