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
    let imageUrl = null;

    // Parse the form data
    const contentType = req.headers['content-type'];

    if (contentType && contentType.includes('multipart/form-data')) {
      // Use busboy to parse form data
      const busboy = require('busboy');
      const bb = busboy({ headers: req.headers });

      const fields = {};
      let imageBuffer = null;
      let imageFileName = null;

      await new Promise((resolve, reject) => {
        bb.on('file', (fieldname, file, info) => {
          if (fieldname === 'image') {
            const chunks = [];
            file.on('data', (data) => chunks.push(data));
            file.on('end', () => {
              imageBuffer = Buffer.concat(chunks);
              imageFileName = `audit_${Date.now()}_${info.filename}`;
            });
          }
        });

        bb.on('field', (fieldname, val) => {
          fields[fieldname] = val;
        });

        bb.on('close', resolve);
        bb.on('error', reject);

        req.pipe(bb);
      });

      if (imageBuffer) {
        try {
          imageUrl = await uploadImage(imageBuffer, imageFileName);
        } catch (uploadError) {
          console.warn('Image upload failed, continuing without image:', uploadError);
        }
      }

      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO audits (store, sku, brand, category, auditType, status, comments, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(
        fields.store || '',
        fields.sku || '',
        fields.brand || '',
        fields.category || '',
        fields.auditType || '',
        fields.status || '',
        fields.comments || '',
        imageUrl
      );

      return res.status(200).json({
        success: true,
        id: result.lastInsertRowid,
        imageUrl: imageUrl,
      });
    } else {
      // JSON payload
      const { store, sku, brand, category, auditType, status, comments, imageData } = req.body;

      let imageUrl = null;
      if (imageData) {
        try {
          const buffer = Buffer.from(imageData, 'base64');
          const fileName = `audit_${Date.now()}.jpg`;
          imageUrl = await uploadImage(buffer, fileName);
        } catch (uploadError) {
          console.warn('Image upload failed:', uploadError);
        }
      }

      const db = getDatabase();
      const stmt = db.prepare(`
        INSERT INTO audits (store, sku, brand, category, auditType, status, comments, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const result = stmt.run(store, sku, brand, category, auditType, status, comments, imageUrl);

      return res.status(200).json({
        success: true,
        id: result.lastInsertRowid,
        imageUrl: imageUrl,
      });
    }
  } catch (error) {
    console.error('Error submitting audit:', error);
    return res.status(500).json({
      error: 'Failed to submit audit',
      details: error.message,
    });
  }
}

export default handler;
