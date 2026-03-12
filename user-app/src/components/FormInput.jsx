const inputBase =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 shadow-sm transition focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
  options,
  rows,
  className = "",
  ...props
}) {
  const id = name

  if (type === "select") {
    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
            {label} {required && "*"}
          </label>
        )}
        <select
          id={id}
          name={name}
          required={required}
          className={inputBase}
          {...props}
        >
          <option value="">{placeholder || "Select..."}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }

  if (type === "textarea") {
    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
            {label} {required && "*"}
          </label>
        )}
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          rows={rows ?? 3}
          className={inputBase}
          {...props}
        />
      </div>
    )
  }

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-gray-700">
          {label} {required && "*"}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={inputBase}
        {...props}
      />
    </div>
  )
}
