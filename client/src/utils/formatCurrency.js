export const formatCurrency = (amount, currency = '₹') => {
  const num = Number(amount) || 0;
  return `${currency} ${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatCurrencyShort = (amount, currency = '₹') => {
  const num = Number(amount) || 0;
  if (num >= 1000000) {
    return `${currency} ${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${currency} ${(num / 1000).toFixed(1)}K`;
  }
  return `${currency} ${num.toFixed(0)}`;
};
