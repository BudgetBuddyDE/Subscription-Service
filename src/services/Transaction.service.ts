import type { TApiResponse, TCreateTransactionPayload, TTransaction } from '../types';

export class TransactionService {
    private static host = process.env.BACKEND_URL + '/v1/transaction';
    private static bearer = `${process.env.SERVICE_UUID}.${process.env.SERVICE_PASSWORD}`;

    static async create(transaction: TCreateTransactionPayload[]): Promise<[TTransaction[] | null, Error | null]> {
        try {
            const response = await fetch(this.host, {
                method: 'POST',
                body: JSON.stringify(transaction),
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    Authorization: `Bearer ${this.bearer}`,
                },
            });
            const json = (await response.json()) as TApiResponse<TTransaction[]>;
            if (json.status != 200) return [null, new Error(json.message!)];
            return [json.data, null];
        } catch (error) {
            console.error(error);
            return [null, error as Error];
        }
    }
}
