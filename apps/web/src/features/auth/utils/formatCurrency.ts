const formatCurrency = (currency: number, noTag?: boolean) =>
  (noTag ? "" : "$") +
  currency.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default formatCurrency;
