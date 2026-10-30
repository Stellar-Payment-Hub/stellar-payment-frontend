export type SubscriptionCadence = 'daily' | 'weekly' | 'monthly' | 'annual';
export type SubscriptionStatus = 'active' | 'paused' | 'delinquent' | 'cancelled' | 'completed';
export type SubscriptionTier = 'bronze' | 'silver' | 'gold' | 'enterprise';

export interface SubscriptionPlan {
  id: string;
  merchantId: string;
  name: string;
  tier: SubscriptionTier;
  amount: number;
  tokenSymbol: string;
  tokenAddress: string;
  cadence: SubscriptionCadence;
  trialDays: number;
  activeSubscribersCount: number;
  createdAt: number;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  merchantAddress: string;
  subscriberAddress: string;
  amount: number;
  tokenSymbol: string;
  cadence: SubscriptionCadence;
  status: SubscriptionStatus;
  nextChargeTimestamp: number;
  lastChargeTimestamp: number;
  cycleCount: number;
  maxCycles?: number;
  allowanceAuthorized: number;
}

export interface BillingInvoiceRecord {
  id: string;
  subscriptionId: string;
  amount: number;
  tokenSymbol: string;
  timestamp: number;
  transactionHash: string;
  status: 'succeeded' | 'failed' | 'retrying';
}
