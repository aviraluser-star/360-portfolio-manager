/**
 * Format a number as Indian Rupees (₹) with lakh/crore comma notation
 * e.g. 1234567.89 → ₹12,34,567.89
 */
export function formatINR(value: number, decimals = 2): string {
  if (Number.isNaN(value)) return "₹0.00";
  const isNegative = value < 0;
  const abs = Math.abs(value);
  const parts = abs.toFixed(decimals).split(".");
  const intPart = parts[0];
  const decPart = parts[1];

  // Indian number formatting: last 3 digits, then groups of 2
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

export function formatINRCompact(value: number): string {
  if (Number.isNaN(value)) return "₹0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_00_00_000) return `${sign}₹${(abs / 1_00_00_000).toFixed(2)}Cr`;
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(2)}L`;
  if (abs >= 1_000) return `${sign}₹${(abs / 1_000).toFixed(1)}K`;
  return `${sign}₹${abs.toFixed(0)}`;
}

export function formatPct(value: number, decimals = 2): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function timestampToDate(ts: bigint): Date {
  // Motoko Timestamp is in nanoseconds
  return new Date(Number(ts / 1_000_000n));
}

export function formatDate(ts: bigint): string {
  return timestampToDate(ts).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
