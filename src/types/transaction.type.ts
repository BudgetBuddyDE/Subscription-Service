import type { description, uuid } from '.';

export type TBaseTransaction = {
    id: number;
    category: number;
    paymentMethod: number;
    receiver: string;
    description: description;
    amount: number;
    date: string | Date;
    created_by: uuid;
    updated_at: string;
    inserted_at: string;
};
