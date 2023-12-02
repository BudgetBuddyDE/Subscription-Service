import type { TApiResponse, TSubscription } from '../types';

export class SubscriptionService {
    private static host = process.env.BACKEND_URL + '/v1/subscription';
    private static bearer = `${process.env.SERVICE_UUID}.${process.env.SERVICE_PASSWORD}`;

    static async getSubscriptions({
        executeAt,
        paused,
    }: Pick<TSubscription, 'executeAt' | 'paused'>): Promise<[TSubscription[] | null, Error | null]> {
        try {
            const query = new URLSearchParams();
            query.append('execute_at', executeAt.toString());
            query.append('paused', String(paused));
            const response = await fetch(this.host + '/all?' + query.toString(), {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    Authorization: `Bearer ${this.bearer}`,
                },
            });
            const json = (await response.json()) as TApiResponse<TSubscription[]>;
            if (json.status != 200) return [null, new Error(json.message!)];
            return [json.data, null];
        } catch (error) {
            console.error(error);
            return [null, error as Error];
        }
    }
}
