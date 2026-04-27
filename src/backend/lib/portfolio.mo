import Float     "mo:core/Float";
import List      "mo:core/List";
import Map       "mo:core/Map";
import Principal "mo:core/Principal";

import Types "../types/portfolio";

module {
  // ── Re-exports ────────────────────────────────────────────────────────────
  public type Holding               = Types.Holding;
  public type HoldingInput          = Types.HoldingInput;
  public type BrokerAccount         = Types.BrokerAccount;
  public type BrokerInput           = Types.BrokerInput;
  public type Counters              = Types.Counters;
  public type PortfolioSettings     = Types.PortfolioSettings;
  public type PortfolioSettingsView = Types.PortfolioSettingsView;
  public type StockRecommendation   = Types.StockRecommendation;
  public type PortfolioSummary      = Types.PortfolioSummary;
  public type RebalanceAlert        = Types.RebalanceAlert;
  public type BenchmarkResult       = Types.BenchmarkResult;
  public type TaxSummary            = Types.TaxSummary;
  public type UserId                = Types.UserId;
  public type HoldingId             = Types.HoldingId;
  public type BrokerId              = Types.BrokerId;

  // ── Holdings ──────────────────────────────────────────────────────────────

  /// Add a new holding; returns the assigned record.
  public func addHolding(
    holdings  : List.List<Holding>,
    counters  : Counters,
    owner     : UserId,
    input     : HoldingInput,
  ) : Holding {
    let h : Holding = {
      id            = counters.nextHoldingId;
      owner         = owner;
      ticker        = input.ticker;
      companyName   = input.companyName;
      quantity      = input.quantity;
      purchasePrice = input.purchasePrice;
      purchaseDate  = input.purchaseDate;
      assetClass    = input.assetClass;
    };
    holdings.add(h);
    counters.nextHoldingId += 1;
    h;
  };

  /// Replace an existing holding by id. Returns false if not found.
  public func updateHolding(
    holdings : List.List<Holding>,
    owner    : UserId,
    id       : HoldingId,
    input    : HoldingInput,
  ) : Bool {
    var found = false;
    holdings.mapInPlace(func(h : Holding) : Holding {
      if (h.id == id and Principal.equal(h.owner, owner)) {
        found := true;
        {
          h with
          ticker        = input.ticker;
          companyName   = input.companyName;
          quantity      = input.quantity;
          purchasePrice = input.purchasePrice;
          purchaseDate  = input.purchaseDate;
          assetClass    = input.assetClass;
        };
      } else { h };
    });
    found;
  };

  /// Remove a holding. Returns false if not found.
  public func deleteHolding(
    holdings : List.List<Holding>,
    owner    : UserId,
    id       : HoldingId,
  ) : Bool {
    let before = holdings.size();
    let kept   = holdings.filter(func(h : Holding) : Bool {
      not (h.id == id and Principal.equal(h.owner, owner))
    });
    holdings.clear();
    holdings.append(kept);
    holdings.size() < before;
  };

  /// List all holdings for a user.
  public func listHoldings(
    holdings : List.List<Holding>,
    owner    : UserId,
  ) : [Holding] {
    holdings.filter(func(h : Holding) : Bool {
      Principal.equal(h.owner, owner)
    }).toArray();
  };

  // ── Broker accounts ───────────────────────────────────────────────────────

  /// Add a broker account; returns the new record.
  public func addBroker(
    brokers  : List.List<BrokerAccount>,
    counters : Counters,
    owner    : UserId,
    input    : BrokerInput,
  ) : BrokerAccount {
    let b : BrokerAccount = {
      id          = counters.nextBrokerId;
      owner       = owner;
      brokerName  = input.brokerName;
      accountId   = input.accountId;
      accountType = input.accountType;
    };
    brokers.add(b);
    counters.nextBrokerId += 1;
    b;
  };

  /// Remove a broker account. Returns false if not found.
  public func removeBroker(
    brokers : List.List<BrokerAccount>,
    owner   : UserId,
    id      : BrokerId,
  ) : Bool {
    let before = brokers.size();
    let kept   = brokers.filter(func(b : BrokerAccount) : Bool {
      not (b.id == id and Principal.equal(b.owner, owner))
    });
    brokers.clear();
    brokers.append(kept);
    brokers.size() < before;
  };

  /// List all broker accounts for a user.
  public func listBrokers(
    brokers : List.List<BrokerAccount>,
    owner   : UserId,
  ) : [BrokerAccount] {
    brokers.filter(func(b : BrokerAccount) : Bool {
      Principal.equal(b.owner, owner)
    }).toArray();
  };

  // ── Portfolio settings ────────────────────────────────────────────────────

  /// Return a shared-safe view of settings.
  public func getSettingsView(settings : PortfolioSettings) : PortfolioSettingsView {
    {
      name                 = settings.name;
      riskFreeRate         = settings.riskFreeRate;
      rebalancingFrequency = settings.rebalancingFrequency;
      targetAllocations    = settings.targetAllocations;
      initialInvestment    = settings.initialInvestment;
      cashBalance          = settings.cashBalance;
    };
  };

  /// Update mutable settings fields from a view.
  public func applySettingsUpdate(
    settings : PortfolioSettings,
    update   : PortfolioSettingsView,
  ) {
    settings.name                 := update.name;
    settings.riskFreeRate         := update.riskFreeRate;
    settings.rebalancingFrequency := update.rebalancingFrequency;
    settings.targetAllocations    := update.targetAllocations;
    settings.initialInvestment    := update.initialInvestment;
    settings.cashBalance          := update.cashBalance;
  };

  // ── Recommendations ───────────────────────────────────────────────────────

  /// Return 7 hard-coded mock daily recommendations for Indian stocks.
  public func getMockRecommendations() : [StockRecommendation] {
    [
      { ticker = "TCS";       companyName = "Tata Consultancy Services"; currentPrice = 3_850.0; targetPrice = 4_200.0; expectedReturn = 9.1;  riskRating = #low;    action = #buy  },
      { ticker = "INFY";      companyName = "Infosys Ltd";               currentPrice = 1_420.0; targetPrice = 1_600.0; expectedReturn = 12.7; riskRating = #low;    action = #buy  },
      { ticker = "RELIANCE";  companyName = "Reliance Industries Ltd";   currentPrice = 2_780.0; targetPrice = 3_050.0; expectedReturn = 9.7;  riskRating = #medium; action = #buy  },
      { ticker = "WIPRO";     companyName = "Wipro Ltd";                 currentPrice =  460.0;  targetPrice =  500.0;  expectedReturn = 8.7;  riskRating = #medium; action = #hold },
      { ticker = "LT";        companyName = "Larsen & Toubro Ltd";       currentPrice = 3_210.0; targetPrice = 3_600.0; expectedReturn = 12.1; riskRating = #medium; action = #buy  },
      { ticker = "BAJAJ-AUTO";companyName = "Bajaj Auto Ltd";            currentPrice = 8_950.0; targetPrice = 9_500.0; expectedReturn = 6.1;  riskRating = #low;    action = #hold },
      { ticker = "MARUTI";    companyName = "Maruti Suzuki India Ltd";   currentPrice = 12_300.0;targetPrice = 13_800.0;expectedReturn = 12.2; riskRating = #medium; action = #buy  },
    ];
  };

  // ── Analytics ─────────────────────────────────────────────────────────────

  /// Compute portfolio summary (total investment, current value, gain/loss).
  public func computeSummary(
    holdings      : List.List<Holding>,
    owner         : UserId,
    currentPrices : Map.Map<Text, Float>,
  ) : PortfolioSummary {
    var totalInvestment = 0.0;
    var totalValue      = 0.0;

    holdings.forEach(func(h : Holding) {
      if (Principal.equal(h.owner, owner)) {
        let cost         = h.quantity * h.purchasePrice;
        let price        = switch (currentPrices.get(h.ticker)) { case (?p) p; case null h.purchasePrice };
        let currentValue = h.quantity * price;
        totalInvestment += cost;
        totalValue      += currentValue;
      };
    });

    let gainLossAmt = totalValue - totalInvestment;
    let gainLossPct = if (totalInvestment == 0.0) 0.0
                      else gainLossAmt / totalInvestment * 100.0;
    { totalInvestment; totalValue; gainLossAmt; gainLossPct };
  };

  // Shared mock returns helper
  func mockDailyReturns() : [Float] {
    [0.8, -0.3, 1.2, 0.5, -0.7, 1.5, 0.2, -0.1, 0.9, 1.1, -0.4, 0.6, 1.3, -0.2, 0.7];
  };

  func meanAndVariance(returns : [Float]) : (Float, Float) {
    let n : Float = returns.size().toFloat();
    var sum = 0.0;
    for (r in returns.values()) { sum += r };
    let mean = sum / n;
    var varSum = 0.0;
    for (r in returns.values()) {
      let diff = r - mean;
      varSum += diff * diff;
    };
    (mean, varSum / n);
  };

  /// Annualised Sharpe ratio using mock daily returns series.
  public func computeSharpeRatio(
    _holdings     : List.List<Holding>,
    _owner        : UserId,
    riskFreeRate : Float,
  ) : Float {
    let returns = mockDailyReturns();
    let (mean, variance) = meanAndVariance(returns);
    let stdDev       = if (variance <= 0.0) 1.0 else Float.sqrt(variance);
    let dailyRf      = riskFreeRate / 252.0;
    let excessReturn = mean - dailyRf;
    excessReturn / stdDev * Float.sqrt(252.0);
  };

  /// Annualised portfolio volatility (standard deviation of mock returns).
  public func computeVolatility(
    _holdings : List.List<Holding>,
    _owner    : UserId,
  ) : Float {
    let (_, variance) = meanAndVariance(mockDailyReturns());
    Float.sqrt(variance) * Float.sqrt(252.0);
  };

  /// List holdings whose allocation drifts more than 5 % from target.
  public func getRebalanceAlerts(
    holdings          : List.List<Holding>,
    owner             : UserId,
    currentPrices     : Map.Map<Text, Float>,
    targetAllocations : [Types.TargetAllocation],
  ) : [RebalanceAlert] {
    // Compute total portfolio value
    var totalValue = 0.0;
    holdings.forEach(func(h : Holding) {
      if (Principal.equal(h.owner, owner)) {
        let price = switch (currentPrices.get(h.ticker)) { case (?p) p; case null h.purchasePrice };
        totalValue += h.quantity * price;
      };
    });

    if (totalValue == 0.0) return [];

    // Group value by assetClass
    var equityValue     = 0.0;
    var mutualFundValue = 0.0;
    holdings.forEach(func(h : Holding) {
      if (Principal.equal(h.owner, owner)) {
        let price = switch (currentPrices.get(h.ticker)) { case (?p) p; case null h.purchasePrice };
        let v = h.quantity * price;
        switch (h.assetClass) {
          case (#equity)     { equityValue     += v };
          case (#mutualFund) { mutualFundValue += v };
        };
      };
    });

    let alerts = List.empty<RebalanceAlert>();
    // Check each target allocation
    for (ta in targetAllocations.values()) {
      let (currentValue, exampleTicker) : (Float, Text) = switch (ta.assetClass) {
        case (#equity)     { (equityValue,     "EQUITY") };
        case (#mutualFund) { (mutualFundValue, "MUTUALFUND") };
      };
      let currentPct = currentValue / totalValue * 100.0;
      let drift      = currentPct - ta.targetPct;
      let absDrift   = if (drift < 0.0) -drift else drift;
      if (absDrift > 5.0) {
        alerts.add({
          ticker     = exampleTicker;
          assetClass = ta.assetClass;
          currentPct;
          targetPct  = ta.targetPct;
          driftPct   = drift;
        });
      };
    };
    alerts.toArray();
  };

  /// Compare portfolio YTD return against mock S&P 500 YTD.
  public func getBenchmark(
    holdings      : List.List<Holding>,
    owner         : UserId,
    currentPrices : Map.Map<Text, Float>,
  ) : BenchmarkResult {
    // Compute a simple YTD return: (totalValue - totalInvestment) / totalInvestment * 100
    let summary = computeSummary(holdings, owner, currentPrices);
    let portfolioYtdReturn = if (summary.totalInvestment == 0.0) 0.0
                             else summary.gainLossPct;
    { portfolioYtdReturn; sp500YtdReturn = 12.4 };
  };

  // ── Tax analysis ──────────────────────────────────────────────────────────

  /// Categorise all positions into STCG / LTCG / unrealized and compute tax.
  public func computeTaxSummary(
    holdings      : List.List<Holding>,
    owner         : UserId,
    currentPrices : Map.Map<Text, Float>,
    now           : Int,
  ) : TaxSummary {
    let nanosecondsPerDay : Int = 86_400_000_000_000;
    let daysIn365         : Int = 365 * nanosecondsPerDay;

    var stcgTotal       = 0.0;
    var ltcgTotal       = 0.0;
    var unrealizedTotal = 0.0;
    var stcgTax         = 0.0;
    var ltcgTax         = 0.0;

    let positions = List.empty<Types.TaxPosition>();

    holdings.forEach(func(h : Holding) {
      if (Principal.equal(h.owner, owner)) {
        let price        = switch (currentPrices.get(h.ticker)) { case (?p) p; case null h.purchasePrice };
        let currentValue = h.quantity * price;
        let costBasis    = h.quantity * h.purchasePrice;
        let gainLossAmt  = currentValue - costBasis;
        let heldDuration = now - h.purchaseDate;

        if (heldDuration < daysIn365) {
          // STCG — held < 365 days
          let taxLiability = if (gainLossAmt > 0.0) gainLossAmt * 0.15 else 0.0;
          stcgTotal += gainLossAmt;
          stcgTax   += taxLiability;
          positions.add({
            ticker = h.ticker; holdingId = h.id; bucket = #stcg;
            gainLossAmt; taxLiability;
          });
        } else {
          // LTCG — held >= 365 days; ₹1 lakh exemption
          let exemption    = 100_000.0;
          let taxableGain  = if (gainLossAmt > exemption) gainLossAmt - exemption else 0.0;
          let taxLiability = taxableGain * 0.10;
          ltcgTotal += gainLossAmt;
          ltcgTax   += taxLiability;
          positions.add({
            ticker = h.ticker; holdingId = h.id; bucket = #ltcg;
            gainLossAmt; taxLiability;
          });
        };

        // Also add to unrealized
        unrealizedTotal += gainLossAmt;
        positions.add({
          ticker = h.ticker; holdingId = h.id; bucket = #unrealized;
          gainLossAmt; taxLiability = 0.0;
        });
      };
    });

    {
      stcgTotal; ltcgTotal; unrealizedTotal;
      stcgTax;   ltcgTax;
      positions  = positions.toArray();
    };
  };

  // ── Helpers ───────────────────────────────────────────────────────────────

  /// Mock current-price map for all tracked Indian tickers.
  public func mockCurrentPrices() : Map.Map<Text, Float> {
    let prices : [(Text, Float)] = [
      ("TCS",        4_050.0),
      ("INFY",       1_530.0),
      ("RELIANCE",   2_920.0),
      ("WIPRO",        478.0),
      ("LT",         3_410.0),
      ("BAJAJ-AUTO", 9_120.0),
      ("MARUTI",    12_850.0),
    ];
    Map.fromArray<Text, Float>(prices);
  };
};
