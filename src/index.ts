import dotenv from 'dotenv';
dotenv.config();
import { CronJob } from 'cron';
import type { TSubscription } from './types';
import { SubscriptionService } from './services/Subscription.service';
import { TransactionService } from './services/Transaction.service';

/**
 * Check if all required environment-variables are set
 */
const MISSING_ENVIRONMENT_VARIABLES = ['BACKEND_URL', 'SERVICE_UUID', 'SERVICE_PASSWORD'].filter((variable) => {
    if (!process.env[variable]) {
        return variable;
    }
});
if (MISSING_ENVIRONMENT_VARIABLES.length >= 1) {
    console.log(
        'ERROR',
        'Starting',
        JSON.stringify({
            missing: MISSING_ENVIRONMENT_VARIABLES,
            error: 'server/missing-environment-variables',
        })
    );
    process.exit();
}

const task = new CronJob('0 3 * * *', async () => {
    let subscriptions: TSubscription[] = [];
    try {
        const [receivedSubscriptions, error] = await SubscriptionService.getSubscriptions({
            executeAt: new Date().getDate(),
            paused: false,
        });
        if (error) throw error;
        if (!receivedSubscriptions || receivedSubscriptions.length === 0) {
            throw new Error('No subscription to process'); // No subscriptions to process
        }
        subscriptions = receivedSubscriptions;

        const [createdTransaction, err] = await TransactionService.create(
            subscriptions.map(({ owner, category, paymentMethod, description, receiver, transferAmount }) => ({
                owner: owner.uuid,
                categoryId: category.id,
                paymentMethodId: paymentMethod.id,
                description: description,
                processedAt: new Date(),
                receiver: receiver,
                transferAmount: transferAmount,
            }))
        );
        if (err) throw err;
        if (!createdTransaction || createdTransaction.length === 0) {
            throw new Error('No transactions created');
        }
        console.log('INFO', '', `Created ${createdTransaction.length} transactions`);
    } catch (error) {
        console.error((error as Error).message);
        console.error('ERROR', '', JSON.stringify(error));
    } finally {
        console.log('INFO', '', `Processed ${subscriptions ? subscriptions.length : 0} active subscriptions`);
    }
});

task.start();
