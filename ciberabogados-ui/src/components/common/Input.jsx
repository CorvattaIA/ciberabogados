import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  className = '',
  ...props
}) => {
  const baseStyle = 'mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm';
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
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={combinedClassName}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
};

export default Input;
