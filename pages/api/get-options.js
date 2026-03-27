export default function handler(req, res) {
  const storeOptions = [
    { value: 'store1', label: 'Store 1' },
    { value: 'store2', label: 'Store 2' },
    { value: 'store3', label: 'Store 3' },
    { value: 'store4', label: 'Store 4' },
  ];

  const skuOptions = [
    { value: 'sku001', label: 'SKU 001' },
    { value: 'sku002', label: 'SKU 002' },
    { value: 'sku003', label: 'SKU 003' },
    { value: 'sku004', label: 'SKU 004' },
    { value: 'sku005', label: 'SKU 005' },
  ];

  return res.status(200).json({
    stores: storeOptions,
    skus: skuOptions,
  });
}
