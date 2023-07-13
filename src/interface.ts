export type uuid = string;

export interface ISubscription {
  id: number;
  paused: boolean;
  category: number;
  paymentMethod: number;
  receiver: string;
  description: string | null;
  amount: number;
  execute_at: number;
  created_by: uuid;
  inserted_at: Date;
  updated_at: Date;
}

export interface ITransaction {
  id?: number;
  category: number;
  paymentMethod: number;
  receiver: string;
  description: string | null;
  amount: number;
  date: Date;
  created_by: uuid;
  inserted_at?: Date;
  updated_at?: Date;
}
