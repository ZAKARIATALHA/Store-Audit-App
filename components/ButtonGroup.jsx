export default function ButtonGroup({ label, options, value, onChange, required }) {
  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-gray-900 mb-3">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`p-4 rounded-lg font-semibold text-base transition-all ${
              value === option.value
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
