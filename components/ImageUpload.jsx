import { useState } from 'react';

export default function ImageUpload({ onImageSelect }) {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreview(event.target.result);
      };
      reader.readAsDataURL(file);
      onImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFileName(null);
    onImageSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-gray-900 mb-2">
        Upload Picture
      </label>

      {!preview ? (
        <div className="w-full">
          <label className="block w-full cursor-pointer">
            <div className="w-full p-8 border-2 border-dashed border-gray-400 rounded-lg text-center bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="text-gray-700">
                <div className="text-3xl mb-2">📷</div>
                <p className="text-lg font-medium">Tap to take a photo</p>
                <p className="text-sm text-gray-600 mt-1">or select from gallery</p>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="w-full">
          <div className="rounded-lg overflow-hidden border-2 border-gray-300 mb-3">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
          <p className="text-sm text-gray-700 mb-3 truncate">
            📁 {fileName}
          </p>
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-full p-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Remove Photo
          </button>
        </div>
      )}
    </div>
  );
}
