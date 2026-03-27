const fs = require('fs');
const path = require('path');

// Use /tmp on Vercel (only writable directory in serverless), fallback for local dev
const DATA_FILE = process.env.VERCEL
  ? '/tmp/audits.json'
  : path.join(process.cwd(), 'audits.json');

function readData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading data file:', err.message);
  }
  return { audits: [], nextId: 1 };
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing data file:', err.message);
  }
}

function saveAudit(store, sku, brand, category, auditType, status, comments, imageUrl) {
  const data = readData();
  const record = {
    id: data.nextId,
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
  data.audits.push(record);
  data.nextId += 1;
  writeData(data);
  return record.id;
}

function getAllAudits() {
  const data = readData();
  return data.audits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

module.exports = {
  initializeStorage: () => {},
  saveAudit,
  getAllAudits,
};
