import { getDatabase } from '@/lib/db';
import { uploadImage } from '@/lib/googleDrive';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { store, sku, brand, category, auditType, status, comments, imageData } = req.body;

    // Validate required fields
    if (!store || !sku || !brand || !category || !auditType || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let imageUrl = null;

    // Upload image if provided
    if (imageData) {
      try {
        const buffer = Buffer.from(imageData.split(',')[1], 'base64');
        const fileName = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
        imageUrl = await uploadImage(buffer, fileName);
      } catch (uploadError) {
        console.warn('Image upload failed, continuing without image:', uploadError);
      }
    }

    // Save to database
    const db = getDatabase();
    const stmt = db.prepare(`
      INSERT INTO audits (store, sku, brand, category, auditType, status, comments, imageUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(store, sku, brand, category, auditType, status, comments || '', imageUrl);

    return res.status(200).json({
      success: true,
      id: result.lastInsertRowid,
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error('Error submitting audit:', error);
    return res.status(500).json({
      error: 'Failed to submit audit',
      details: error.message,
    });
  }
}

export default handler;
