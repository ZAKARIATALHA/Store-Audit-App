const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_PATH || './audit.db';

let db;

function initializeDatabase() {
  const dbDir = path.dirname(dbPath);
  if (dbDir !== '.' && !fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store TEXT NOT NULL,
      sku TEXT NOT NULL,
      brand TEXT NOT NULL,
      category TEXT NOT NULL,
      auditType TEXT NOT NULL,
      status TEXT NOT NULL,
      comments TEXT,
      imageUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return db;
}

function getDatabase() {
  if (!db) {
    initializeDatabase();
  }
  return db;
}

module.exports = {
  initializeDatabase,
  getDatabase,
};
