import Common "common";

module {
  public type UserId    = Common.UserId;
  public type Timestamp = Common.Timestamp;
  public type HoldingId = Common.HoldingId;
  public type BrokerId  = Common.BrokerId;

  // ── Counters (mutable record so mixins can mutate via reference) ─────────
  public type Counters = {
    var nextHoldingId : Nat;
    var nextBrokerId  : Nat;
  };

  // ── Asset classification ─────────────────────────────────────────────────
  public type AssetClass = { #equity; #mutualFund };

  // ── Portfolio settings ───────────────────────────────────────────────────
  public type TargetAllocation = {
    assetClass : AssetClass;
    targetPct  : Float;          // 0–100
  };

  public type RebalancingFrequency = { #daily; #weekly; #monthly };

  public type PortfolioSettings = {
    var name                 : Text;
    var riskFreeRate         : Float;   // e.g. 0.07 for 7 %
    var rebalancingFrequency : RebalancingFrequency;
    var targetAllocations    : [TargetAllocation];
    var initialInvestment    : Float;   // ₹
    var cashBalance          : Float;   // ₹
  };

  // Shared (no var) version returned over the wire
  public type PortfolioSettingsView = {
    name                 : Text;
    riskFreeRate         : Float;
    rebalancingFrequency : RebalancingFrequency;
    targetAllocations    : [TargetAllocation];
    initialInvestment    : Float;
    cashBalance          : Float;
  };

  // ── Holdings ─────────────────────────────────────────────────────────────
  public type HoldingInput = {
    ticker        : Text;
    companyName   : Text;
    quantity      : Float;
    purchasePrice : Float;    // ₹ per unit
    purchaseDate  : Timestamp;
    assetClass    : AssetClass;
  };

  public type Holding = {
    id            : HoldingId;
    owner         : UserId;
    ticker        : Text;
    companyName   : Text;
    quantity      : Float;
    purchasePrice : Float;
    purchaseDate  : Timestamp;
    assetClass    : AssetClass;
  };

  // ── Broker accounts ───────────────────────────────────────────────────────
  public type AccountType = { #delivery; #intraday; #both };

  public type BrokerInput = {
    brokerName  : Text;
    accountId   : Text;
    accountType : AccountType;
  };

  public type BrokerAccount = {
    id          : BrokerId;
    owner       : UserId;
    brokerName  : Text;
    accountId   : Text;
    accountType : AccountType;
  };

  // ── Recommendations ───────────────────────────────────────────────────────
  public type RiskRating = { #low; #medium; #high };
  public type Action     = { #buy; #hold; #sell };

  public type StockRecommendation = {
    ticker         : Text;
    companyName    : Text;
    currentPrice   : Float;   // ₹
    targetPrice    : Float;   // ₹
    expectedReturn : Float;   // percentage
    riskRating     : RiskRating;
    action         : Action;
  };

  // ── Analytics ─────────────────────────────────────────────────────────────
  public type PortfolioSummary = {
    totalInvestment : Float;   // ₹
    totalValue      : Float;   // ₹
    gainLossAmt     : Float;   // ₹
    gainLossPct     : Float;   // percentage
  };

  public type RebalanceAlert = {
    ticker        : Text;
    assetClass    : AssetClass;
    currentPct    : Float;
    targetPct     : Float;
    driftPct      : Float;
  };

  public type BenchmarkResult = {
    portfolioYtdReturn : Float;  // percentage
    sp500YtdReturn     : Float;  // percentage (mock)
  };

  // ── Tax analysis ──────────────────────────────────────────────────────────
  public type TaxBucket = { #stcg; #ltcg; #unrealized };

  public type TaxPosition = {
    ticker          : Text;
    holdingId       : HoldingId;
    bucket          : TaxBucket;
    gainLossAmt     : Float;   // ₹
    taxLiability    : Float;   // ₹
  };

  public type TaxSummary = {
    stcgTotal        : Float;  // ₹ total STCG gain
    ltcgTotal        : Float;  // ₹ total LTCG gain
    unrealizedTotal  : Float;  // ₹
    stcgTax          : Float;  // ₹ (15 %)
    ltcgTax          : Float;  // ₹ (10 %)
    positions        : [TaxPosition];
  };
};
