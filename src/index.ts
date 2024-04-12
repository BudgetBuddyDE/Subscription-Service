import dotenv from 'dotenv';
dotenv.config();
import {CronJob} from 'cron';
import {logger} from './logger';
import {
  PocketBaseCollection,
  type TCreateTransactionPayload,
  ZSubscription,
  type TSubscription,
} from '@budgetbuddyde/types';
import {pb} from './pocketbase';
import {z} from 'zod';

/**
 * Check if all required environment-variables are set
 */
const MISSING_ENVIRONMENT_VARIABLES = ['POCKETBASE_URL', 'SERVICE_ACCOUNT_EMAIL', 'SERVICE_ACCOUNT_PASSWORD'].filter(
  variable => {
    if (!process.env[variable]) {
      return variable;
    }
  },
);
if (MISSING_ENVIRONMENT_VARIABLES.length >= 1) {
  console.log(
    'ERROR',
    'Starting',
    JSON.stringify({
      missing: MISSING_ENVIRONMENT_VARIABLES,
      error: 'server/missing-environment-variables',
    }),
  );
  process.exit();
}

const task = new CronJob('0 3 * * *', async () => {
  try {
    const {SERVICE_ACCOUNT_EMAIL, SERVICE_ACCOUNT_PASSWORD} = process.env;
    if (!SERVICE_ACCOUNT_EMAIL || !SERVICE_ACCOUNT_PASSWORD) {
      throw new Error('SERVICE_ACCOUNT_EMAIL or SERVICE_ACCOUNT_PASSWORD is not set!');
    }
    const authStatus = await pb.admins.authWithPassword(SERVICE_ACCOUNT_EMAIL, SERVICE_ACCOUNT_PASSWORD);
    logger.info(
      'Successfully authenticated as a admin-account against Pocketbase! Account: ' + authStatus.admin.email,
      {
        session: authStatus,
      },
    );
  } catch (error) {
    const err = error as Error;
    logger.error(`Wasn't able to verify as a admin-account against Pocketbase! Reason: ${err.message}`, {
      name: err.name,
      error: err.message,
      stack: err.stack,
    });
  }

  let subscriptions: TSubscription[] = [];

  try {
    const records = await pb.collection(PocketBaseCollection.SUBSCRIPTION).getFullList({
      expand: 'payment_method,category',
      filter: `paused = false && execute_at = ${new Date().getDate()}`,
    });
    if (records.length === 0) {
      logger.info('No subscription to process');
      return;
    }

    const parsedSubscriptions = z.array(ZSubscription).safeParse(records);
    if (!parsedSubscriptions.success) {
      throw parsedSubscriptions.error;
    }

    subscriptions = parsedSubscriptions.data;

    const transactionPayloads: TCreateTransactionPayload[] = subscriptions.map(
      ({owner, category, payment_method, information, receiver, transfer_amount}) => ({
        owner: owner,
        category: category,
        payment_method: payment_method,
        information: information,
        processed_at: new Date(),
        receiver: receiver,
        transfer_amount: transfer_amount,
      }),
    );

    let count = 0;
    for (const payload of transactionPayloads) {
      const createdTransaction = await pb.collection(PocketBaseCollection.TRANSACTION).create(payload);
      logger.info(`Created transaction #${createdTransaction.id}`, {id: createdTransaction.id});
      count++;
    }

    logger.info(`Successfully created ${count} transactions`, {count: count});
  } catch (error) {
    const err = error as Error;
    logger.error(err.message, {
      name: err.name,
      message: err.message,
      stack: err.stack,
    });
  }
});

task.start();
