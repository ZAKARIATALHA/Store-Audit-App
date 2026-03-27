export default function SelectDropdown({ label, options, value, onChange, required, placeholder }) {
  return (
    <div className="w-full">
      <label className="block text-lg font-semibold text-gray-900 mb-2">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 bg-white"
        required={required}
      >
        <option value="">{placeholder || 'Select...'}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
