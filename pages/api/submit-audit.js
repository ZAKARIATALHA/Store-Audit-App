import { initializeStorage, saveAudit } from '@/lib/storage';
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
    initializeStorage();

    const { store, sku, brand, category, auditType, status, comments, imageData } = req.body;

    // Validate required fields
    if (!store || !sku || !brand || !category || !auditType || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let imageUrl = null;

    // Upload image if provided
    if (imageData) {
      try {
        const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
        const buffer = Buffer.from(base64Data, 'base64');
        const fileName = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
        imageUrl = await uploadImage(buffer, fileName);
      } catch (uploadError) {
        console.warn('Image upload failed, continuing without image:', uploadError);
      }
    }

    // Save to storage
    const id = saveAudit(store, sku, brand, category, auditType, status, comments || '', imageUrl);

    return res.status(200).json({
      success: true,
      id: id,
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
