import type { description, uuid } from '.';

export type TBaseSubscription = {
  id: number;
  /** Default `false` */
  paused: boolean;
  category: number;
  paymentMethod: number;
  receiver: string;
  description: description;
  amount: number;
  execute_at: number;
  created_by: uuid;
  updated_at: string | Date;
  inserted_at: string | Date;
};
