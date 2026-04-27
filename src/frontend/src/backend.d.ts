import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface BrokerInput {
    accountId: string;
    accountType: AccountType;
    brokerName: string;
}
export type Timestamp = bigint;
export type BrokerId = bigint;
export interface TaxSummary {
    ltcgTax: number;
    stcgTax: number;
    unrealizedTotal: number;
    stcgTotal: number;
    positions: Array<TaxPosition>;
    ltcgTotal: number;
}
export interface TargetAllocation {
    targetPct: number;
    assetClass: AssetClass;
}
export interface PortfolioSummary {
    gainLossAmt: number;
    gainLossPct: number;
    totalInvestment: number;
    totalValue: number;
}
export interface BenchmarkResult {
    sp500YtdReturn: number;
    portfolioYtdReturn: number;
}
export interface RebalanceAlert {
    ticker: string;
    targetPct: number;
    currentPct: number;
    driftPct: number;
    assetClass: AssetClass;
}
export interface BrokerAccount {
    id: BrokerId;
    accountId: string;
    owner: UserId;
    accountType: AccountType;
    brokerName: string;
}
export type UserId = Principal;
export interface HoldingInput {
    ticker: string;
    purchasePrice: number;
    purchaseDate: Timestamp;
    companyName: string;
    quantity: number;
    assetClass: AssetClass;
}
export interface StockRecommendation {
    currentPrice: number;
    action: Action;
    ticker: string;
    expectedReturn: number;
    riskRating: RiskRating;
    targetPrice: number;
    companyName: string;
}
export interface PortfolioSettingsView {
    name: string;
    targetAllocations: Array<TargetAllocation>;
    rebalancingFrequency: RebalancingFrequency;
    riskFreeRate: number;
    cashBalance: number;
    initialInvestment: number;
}
export type HoldingId = bigint;
export interface Holding {
    id: HoldingId;
    ticker: string;
    purchasePrice: number;
    purchaseDate: Timestamp;
    owner: UserId;
    companyName: string;
    quantity: number;
    assetClass: AssetClass;
}
export interface TaxPosition {
    gainLossAmt: number;
    ticker: string;
    taxLiability: number;
    holdingId: HoldingId;
    bucket: TaxBucket;
}
export enum AccountType {
    both = "both",
    intraday = "intraday",
    delivery = "delivery"
}
export enum Action {
    buy = "buy",
    hold = "hold",
    sell = "sell"
}
export enum AssetClass {
    mutualFund = "mutualFund",
    equity = "equity"
}
export enum RebalancingFrequency {
    monthly = "monthly",
    daily = "daily",
    weekly = "weekly"
}
export enum RiskRating {
    low = "low",
    high = "high",
    medium = "medium"
}
export enum TaxBucket {
    ltcg = "ltcg",
    stcg = "stcg",
    unrealized = "unrealized"
}
export interface backendInterface {
    addBroker(input: BrokerInput): Promise<BrokerAccount>;
    addHolding(input: HoldingInput): Promise<Holding>;
    deleteHolding(id: HoldingId): Promise<boolean>;
    getBenchmark(): Promise<BenchmarkResult>;
    getDailyRecommendations(): Promise<Array<StockRecommendation>>;
    getPortfolioSummary(): Promise<PortfolioSummary>;
    getRebalanceAlerts(): Promise<Array<RebalanceAlert>>;
    getSettings(): Promise<PortfolioSettingsView>;
    getSharpeRatio(): Promise<number>;
    getTaxSummary(): Promise<TaxSummary>;
    getVolatility(): Promise<number>;
    listBrokers(): Promise<Array<BrokerAccount>>;
    listHoldings(): Promise<Array<Holding>>;
    removeBroker(id: BrokerId): Promise<boolean>;
    updateHolding(id: HoldingId, input: HoldingInput): Promise<boolean>;
    updateSettings(update: PortfolioSettingsView): Promise<void>;
}
