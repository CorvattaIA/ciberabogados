import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  const baseStyle = 'bg-white rounded-lg shadow-md overflow-hidden';

  const combinedClassName = `
    ${baseStyle}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export default Card;
