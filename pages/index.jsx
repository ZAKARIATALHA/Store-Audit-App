import { useState, useEffect } from 'react';
import SelectDropdown from '@/components/SelectDropdown';
import ButtonGroup from '@/components/ButtonGroup';
import ImageUpload from '@/components/ImageUpload';
import Link from 'next/link';

export default function Home() {
  const [formData, setFormData] = useState({
    store: '',
    sku: '',
    brand: '',
    category: '',
    auditType: '',
    status: '',
    comments: '',
  });

  const [image, setImage] = useState(null);
  const [options, setOptions] = useState({ stores: [], skus: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/get-options');
        const data = await response.json();
        setOptions(data);
      } catch (err) {
        console.error('Failed to fetch options:', err);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleImageSelect = (file) => {
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.store ||
      !formData.sku ||
      !formData.brand ||
      !formData.category ||
      !formData.auditType ||
      !formData.status
    ) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageData = null;

      if (image) {
        // Convert image to base64
        const reader = new FileReader();
        imageData = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
      }

      const response = await fetch('/api/submit-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store: formData.store,
          sku: formData.sku,
          brand: formData.brand,
          category: formData.category,
          auditType: formData.auditType,
          status: formData.status,
          comments: formData.comments || '',
          imageData: imageData,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit audit');
      }

      setSuccess(true);
      setFormData({
        store: '',
        sku: '',
        brand: '',
        category: '',
        auditType: '',
        status: '',
        comments: '',
      });
      setImage(null);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'An error occurred while submitting the form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-8">
      {/* Header */}
      <div className="bg-blue-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Store Audit</h1>
          <p className="text-blue-100 text-sm">Data Collection Tool</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Navigation Links */}
        <div className="flex gap-2 mb-6">
          <Link
            href="/"
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors"
          >
            New Audit
          </Link>
          <Link
            href="/records"
            className="flex-1 px-3 py-2 bg-gray-300 text-gray-900 rounded-lg text-center font-semibold hover:bg-gray-400 transition-colors"
          >
            Records
          </Link>
          <a
            href="/api/export-csv"
            className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-center font-semibold hover:bg-green-700 transition-colors"
          >
            Export CSV
          </a>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-600 text-green-700 rounded">
            <p className="font-semibold">✓ Audit submitted successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
            <p className="font-semibold">✗ {error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <SelectDropdown
            label="Store"
            options={options.stores}
            value={formData.store}
            onChange={(value) => handleChange('store', value)}
            required
            placeholder="Select a store"
          />

          <SelectDropdown
            label="SKU"
            options={options.skus}
            value={formData.sku}
            onChange={(value) => handleChange('sku', value)}
            required
            placeholder="Select a SKU"
          />

          <ButtonGroup
            label="Brand"
            options={[
              { value: 'SS', label: 'SS' },
              { value: 'X', label: 'X' },
            ]}
            value={formData.brand}
            onChange={(value) => handleChange('brand', value)}
            required
          />

          <ButtonGroup
            label="Category"
            options={[
              { value: 'REF', label: 'REF' },
              { value: 'WM', label: 'WM' },
              { value: 'DW', label: 'DW' },
            ]}
            value={formData.category}
            onChange={(value) => handleChange('category', value)}
            required
          />

          <ButtonGroup
            label="Audit Type"
            options={[
              { value: 'Flooring', label: 'Flooring' },
              { value: 'Cluster', label: 'Cluster' },
              { value: 'End cap', label: 'End cap' },
              { value: 'POP', label: 'POP' },
            ]}
            value={formData.auditType}
            onChange={(value) => handleChange('auditType', value)}
            required
          />

          <ButtonGroup
            label="Status"
            options={[
              { value: 'Good', label: 'Good' },
              { value: 'Damaged', label: 'Damaged' },
              { value: 'Missing', label: 'Missing' },
            ]}
            value={formData.status}
            onChange={(value) => handleChange('status', value)}
            required
          />

          <div className="w-full">
            <label className="block text-lg font-semibold text-gray-900 mb-2">Comments</label>
            <textarea
              value={formData.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              className="w-full p-4 text-base border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 resize-none"
              rows="4"
              placeholder="Add any additional comments..."
            />
          </div>

          <ImageUpload onImageSelect={handleImageSelect} />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Audit'}
          </button>
        </form>
      </div>
    </div>
  );
}
