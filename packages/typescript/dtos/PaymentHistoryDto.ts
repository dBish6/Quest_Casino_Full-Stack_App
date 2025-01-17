export interface PaymentHistoryEntry {
  type: "deposit" | "withdraw";
  amount: number;
  timestamp: string;
}

export interface PaymentHistoryResponseDto {
  user: { payment_history: PaymentHistoryEntry[] }
}
