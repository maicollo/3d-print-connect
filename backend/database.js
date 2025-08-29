// database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(__dirname, 'database.db'));

function initDb() {
  db.serialize(() => {
    // Users
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // Providers (come prima)
    db.run(`
      CREATE TABLE IF NOT EXISTS providers (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        distance REAL NOT NULL,
        rating REAL NOT NULL,
        avatarUrl TEXT,
        isBusiness INTEGER NOT NULL,
        motto TEXT
      )
    `);

    // Orders (come prima)
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT NOT NULL,
        fileName TEXT,
        ideaDescription TEXT,
        material TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL,
        providerId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        FOREIGN KEY (providerId) REFERENCES providers(id),
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

    console.log('✅ Database inizializzato.');
  });
}

module.exports = { db, initDb };