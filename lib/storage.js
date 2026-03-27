/**
 * Storage abstraction layer
 * Tries better-sqlite3 first, falls back to in-memory storage for serverless
 */

let db = null;
let useDb = false;
const memoryRecords = [];

function initializeStorage() {
  try {
    const Database = require('better-sqlite3');
    const path = require('path');
    const fs = require('fs');

    const dbPath = process.env.DATABASE_PATH || './audit.db';
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

    useDb = true;
    console.log('Using SQLite database');
    return true;
  } catch (error) {
    console.warn('SQLite not available, using in-memory storage:', error.message);
    useDb = false;
    return false;
  }
}

function saveAudit(store, sku, brand, category, auditType, status, comments, imageUrl) {
  if (useDb && db) {
    const stmt = db.prepare(`
      INSERT INTO audits (store, sku, brand, category, auditType, status, comments, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(store, sku, brand, category, auditType, status, comments, imageUrl);
    return result.lastInsertRowid;
  } else {
    const record = {
      id: memoryRecords.length + 1,
      store,
      sku,
      brand,
      category,
      auditType,
      status,
      comments,
      imageUrl,
      createdAt: new Date().toISOString(),
    };
    memoryRecords.push(record);
    return record.id;
  }
}

function getAllAudits() {
  if (useDb && db) {
    return db.prepare('SELECT * FROM audits ORDER BY createdAt DESC').all();
  } else {
    return memoryRecords.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

function clearMemoryRecords() {
  if (!useDb) {
    memoryRecords.length = 0;
  }
}

module.exports = {
  initializeStorage,
  saveAudit,
  getAllAudits,
  clearMemoryRecords,
  getDb: () => db,
};
