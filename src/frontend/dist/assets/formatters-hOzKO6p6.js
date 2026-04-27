function formatINR(value, decimals = 2) {
  if (Number.isNaN(value)) return "₹0.00";
  const isNegative = value < 0;
  const abs = Math.abs(value);
  const parts = abs.toFixed(decimals).split(".");
  const intPart = parts[0];
  const decPart = parts[1];
  let formatted = "";
  if (intPart.length <= 3) {
    formatted = intPart;
  } else {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    const groups = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    formatted = `${groups},${last3}`;
  }
  const result = decimals > 0 ? `₹${formatted}.${decPart}` : `₹${formatted}`;
  return isNegative ? `-${result}` : result;
}
function formatINRCompact(value) {
  if (Number.isNaN(value)) return "₹0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1e7) return `${sign}₹${(abs / 1e7).toFixed(2)}Cr`;
  if (abs >= 1e5) return `${sign}₹${(abs / 1e5).toFixed(2)}L`;
  if (abs >= 1e3) return `${sign}₹${(abs / 1e3).toFixed(1)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
}
function formatPct(value, decimals = 2) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}
function timestampToDate(ts) {
  return new Date(Number(ts / 1000000n));
}
function formatDate(ts) {
  return timestampToDate(ts).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}
export {
  formatINRCompact as a,
  formatINR as b,
  formatDate as c,
  formatPct as f
};
