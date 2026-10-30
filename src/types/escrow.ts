export type EscrowStatus = 'pending' | 'funded' | 'disputed' | 'settled' | 'refunded';

export interface MilestoneItem {
  id: string;
  title: string;
  amount: number;
  completed: boolean;
  evidenceIpfsHash?: string;
  completedAt?: number;
}

export interface EscrowEntity {
  id: string;
  title: string;
  buyer: string;
  seller: string;
  arbitrator: string;
  tokenSymbol: string;
  totalAmount: number;
  releasedAmount: number;
  deadlineTimestamp: number;
  status: EscrowStatus;
  milestones: MilestoneItem[];
  approvals: string[]; // addresses that approved release
  arbitratorFeeBps: number;
  createdAt: number;
}

export interface DisputeRecord {
  escrowId: string;
  raisedBy: string;
  reason: string;
  details: string;
  createdAt: number;
  buyerEvidenceHashes: string[];
  sellerEvidenceHashes: string[];
}
