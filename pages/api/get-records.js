import { initializeStorage, getAllAudits } from '@/lib/storage';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initializeStorage();
    const records = getAllAudits();
    return res.status(200).json({ records });
  } catch (error) {
    console.error('Error fetching records:', error);
    return res.status(500).json({
      error: 'Failed to fetch records',
      details: error.message,
    });
  }
}
