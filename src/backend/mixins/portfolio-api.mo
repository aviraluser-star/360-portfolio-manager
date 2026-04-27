import List  "mo:core/List";
import Time  "mo:core/Time";

import Types "../types/portfolio";
import Lib   "../lib/portfolio";

mixin (
  holdings : List.List<Lib.Holding>,
  brokers  : List.List<Lib.BrokerAccount>,
  counters : Lib.Counters,
  settings : Lib.PortfolioSettings,
) {
  // ── Holdings ──────────────────────────────────────────────────────────────

  public shared ({ caller }) func addHolding(input : Lib.HoldingInput) : async Lib.Holding {
    Lib.addHolding(holdings, counters, caller, input);
  };

  public shared ({ caller }) func updateHolding(id : Lib.HoldingId, input : Lib.HoldingInput) : async Bool {
    Lib.updateHolding(holdings, caller, id, input);
  };

  public shared ({ caller }) func deleteHolding(id : Lib.HoldingId) : async Bool {
    Lib.deleteHolding(holdings, caller, id);
  };

  public shared query ({ caller }) func listHoldings() : async [Lib.Holding] {
    Lib.listHoldings(holdings, caller);
  };

  // ── Broker accounts ───────────────────────────────────────────────────────

  public shared ({ caller }) func addBroker(input : Lib.BrokerInput) : async Lib.BrokerAccount {
    Lib.addBroker(brokers, counters, caller, input);
  };

  public shared ({ caller }) func removeBroker(id : Lib.BrokerId) : async Bool {
    Lib.removeBroker(brokers, caller, id);
  };

  public shared query ({ caller }) func listBrokers() : async [Lib.BrokerAccount] {
    Lib.listBrokers(brokers, caller);
  };

  // ── Stock recommendations ─────────────────────────────────────────────────

  public query func getDailyRecommendations() : async [Lib.StockRecommendation] {
    Lib.getMockRecommendations();
  };

  // ── Analytics ─────────────────────────────────────────────────────────────

  public shared query ({ caller }) func getPortfolioSummary() : async Lib.PortfolioSummary {
    let prices = Lib.mockCurrentPrices();
    Lib.computeSummary(holdings, caller, prices);
  };

  public shared query ({ caller }) func getSharpeRatio() : async Float {
    Lib.computeSharpeRatio(holdings, caller, settings.riskFreeRate);
  };

  public shared query ({ caller }) func getVolatility() : async Float {
    Lib.computeVolatility(holdings, caller);
  };

  public shared query ({ caller }) func getRebalanceAlerts() : async [Types.RebalanceAlert] {
    let prices = Lib.mockCurrentPrices();
    Lib.getRebalanceAlerts(holdings, caller, prices, settings.targetAllocations);
  };

  public shared query ({ caller }) func getBenchmark() : async Lib.BenchmarkResult {
    let prices = Lib.mockCurrentPrices();
    Lib.getBenchmark(holdings, caller, prices);
  };

  // ── Tax analysis ──────────────────────────────────────────────────────────

  public shared query ({ caller }) func getTaxSummary() : async Lib.TaxSummary {
    let prices = Lib.mockCurrentPrices();
    Lib.computeTaxSummary(holdings, caller, prices, Time.now());
  };

  // ── Settings ──────────────────────────────────────────────────────────────

  public shared query ({ caller }) func getSettings() : async Lib.PortfolioSettingsView {
    Lib.getSettingsView(settings);
  };

  public shared ({ caller }) func updateSettings(update : Lib.PortfolioSettingsView) : async () {
    Lib.applySettingsUpdate(settings, update);
  };
};
