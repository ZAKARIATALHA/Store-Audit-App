import { initializeStorage, getAllAudits } from '@/lib/storage';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    initializeStorage();
    const rows = getAllAudits();

    // Create CSV header
    const headers = ['ID', 'Store', 'SKU', 'Brand', 'Category', 'Audit Type', 'Status', 'Comments', 'Image URL', 'Created At'];
    const csvContent = [
      headers.join(','),
      ...rows.map(row =>
        [
          row.id,
          `"${row.store}"`,
          `"${row.sku}"`,
          row.brand,
          row.category,
          row.auditType,
          row.status,
          `"${(row.comments || '').replace(/"/g, '""')}"`,
          `"${row.imageUrl || ''}"`,
          row.createdAt,
        ].join(',')
      ),
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit_data_${new Date().toISOString().split('T')[0]}.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return res.status(500).json({
      error: 'Failed to export data',
      details: error.message,
    });
  }
}
