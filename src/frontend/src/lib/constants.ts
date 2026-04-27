export const INDIAN_BROKERS = [
  "Zerodha",
  "Groww",
  "Upstox",
  "Angel One",
  "HDFC Securities",
  "ICICI Direct",
  "Kotak Securities",
  "Fyers",
  "5paisa",
  "Sharekhan",
  "IIFL",
  "Motilal Oswal",
] as const;

export type IndianBroker = (typeof INDIAN_BROKERS)[number];

export const NSE_STOCKS = [
  { ticker: "TCS", companyName: "Tata Consultancy Services" },
  { ticker: "INFY", companyName: "Infosys" },
  { ticker: "RELIANCE", companyName: "Reliance Industries" },
  { ticker: "WIPRO", companyName: "Wipro" },
  { ticker: "HDFCBANK", companyName: "HDFC Bank" },
  { ticker: "ICICIBANK", companyName: "ICICI Bank" },
  { ticker: "BHARTIARTL", companyName: "Bharti Airtel" },
  { ticker: "ASIANPAINT", companyName: "Asian Paints" },
  { ticker: "KOTAKBANK", companyName: "Kotak Mahindra Bank" },
  { ticker: "LT", companyName: "Larsen & Toubro" },
  { ticker: "SUNPHARMA", companyName: "Sun Pharmaceutical" },
  { ticker: "TITAN", companyName: "Titan Company" },
  { ticker: "BAJFINANCE", companyName: "Bajaj Finance" },
  { ticker: "NESTLEIND", companyName: "Nestle India" },
  { ticker: "ULTRACEMCO", companyName: "UltraTech Cement" },
] as const;

export const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { path: "/holdings", label: "Holdings", icon: "Briefcase" },
  { path: "/recommendations", label: "Recommendations", icon: "TrendingUp" },
  { path: "/risk", label: "Risk Metrics", icon: "BarChart2" },
  { path: "/tax", label: "Tax Analysis", icon: "FileText" },
  { path: "/settings", label: "Settings", icon: "Settings" },
] as const;
