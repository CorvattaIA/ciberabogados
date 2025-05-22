import React from 'react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  error,
  className = '',
  ...props
}) => {
  const baseStyle = 'mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md';
  const errorStyle = 'border-danger focus:ring-danger focus:border-danger';

  const combinedClassName = `
    ${baseStyle}
    ${error ? errorStyle : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={combinedClassName}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default Select;
