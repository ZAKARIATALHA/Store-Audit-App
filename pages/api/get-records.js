import { getDatabase } from '@/lib/db';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const db = getDatabase();
    const records = db.prepare('SELECT * FROM audits ORDER BY createdAt DESC').all();
    return res.status(200).json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
    return res.status(500).json({
      error: 'Failed to fetch records',
      details: error.message,
    });
  }
}
