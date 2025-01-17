export const TRANSACTION_TYPES = ["deposit", "withdraw"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];
