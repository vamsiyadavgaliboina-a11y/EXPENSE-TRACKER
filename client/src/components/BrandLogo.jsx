import React from 'react';

const BrandLogo = ({ className = '' }) => (
  <img
    src="/logo.svg"
    alt="Expense Tracker"
    className={className}
  />
);

export default BrandLogo;