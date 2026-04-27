import List "mo:core/List";

import PortfolioLib   "lib/portfolio";
import PortfolioApi   "mixins/portfolio-api";

actor {
  // ── State ─────────────────────────────────────────────────────────────────
  let holdings = List.empty<PortfolioLib.Holding>();
  let brokers  = List.empty<PortfolioLib.BrokerAccount>();

  let counters : PortfolioLib.Counters = {
    var nextHoldingId = 0;
    var nextBrokerId  = 0;
  };

  let settings : PortfolioLib.PortfolioSettings = {
    var name                 = "My Portfolio";
    var riskFreeRate         = 0.07;
    var rebalancingFrequency = #monthly;
    var targetAllocations    = [];
    var initialInvestment    = 0.0;
    var cashBalance          = 0.0;
  };

  // ── Mixins ────────────────────────────────────────────────────────────────
  include PortfolioApi(holdings, brokers, counters, settings);
};
