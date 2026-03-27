import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDatabase } from '@/lib/db';

export default function Records({ initialRecords = [] }) {
  const [records, setRecords] = useState(initialRecords);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/get-records');
        const data = await response.json();
        setRecords(data.records);
      } catch (err) {
        console.error('Failed to fetch records:', err);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-8">
      {/* Header */}
      <div className="bg-blue-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Store Audit</h1>
          <p className="text-blue-100 text-sm">Records</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Navigation Links */}
        <div className="flex gap-2 mb-6">
          <Link
            href="/"
            className="flex-1 px-3 py-2 bg-gray-300 text-gray-900 rounded-lg text-center font-semibold hover:bg-gray-400 transition-colors"
          >
            New Audit
          </Link>
          <Link
            href="/records"
            className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-center font-semibold hover:bg-blue-700 transition-colors"
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

        {/* Records List */}
        {records.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 text-lg">No records found</p>
            <Link href="/">
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Create New Audit
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => (
              <div
                key={record.id}
                className="bg-white p-5 rounded-lg shadow hover:shadow-lg transition-shadow border-l-4 border-blue-600"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {record.store} - {record.sku}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      record.status === 'Good'
                        ? 'bg-green-100 text-green-800'
                        : record.status === 'Damaged'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <p className="text-gray-600">Brand</p>
                    <p className="font-semibold text-gray-900">{record.brand}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900">{record.category}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Audit Type</p>
                    <p className="font-semibold text-gray-900">{record.auditType}</p>
                  </div>
                </div>

                {record.comments && (
                  <div className="mb-3 p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">{record.comments}</p>
                  </div>
                )}

                {record.imageUrl && (
                  <a
                    href={record.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:text-blue-800 font-semibold text-sm"
                  >
                    📷 View Image
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const { getDatabase } = require('@/lib/db');
    const db = getDatabase();
    const records = db.prepare('SELECT * FROM audits ORDER BY createdAt DESC').all();
    return {
      props: {
        initialRecords: records,
      },
    };
  } catch (error) {
    console.error('Error fetching records:', error);
    return {
      props: {
        initialRecords: [],
      },
    };
  }
}
