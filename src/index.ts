import dotenv from 'dotenv';
dotenv.config();

/**
 * Check if all required environment-variables are set
 */
const MISSING_ENVIRONMENT_VARIABLES = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SERVICE_EMAIL',
  'SERVICE_PASSWORD',
].filter((variable) => {
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
      error: 'server/missing-environmentv-variables',
    })
  );
  process.exit();
}

import { CronJob } from 'cron';
import { supabase } from './supabase';
import type { ISubscription, ITransaction } from './interface';
import { User } from '@supabase/supabase-js';

const task = new CronJob('0 1 * * *', async () => {
  try {
    await authClient(process.env.SERVICE_EMAIL!, process.env.SERVICE_PASSWORD!);

    const subscriptions = await getSubscriptions();
    if (!subscriptions || subscriptions.length === 0) return; // No subscriptions to process

    const { data, error } = await supabase.from<ITransaction>('transactions').insert(
      subscriptions.map(
        ({ category, paymentMethod, amount, created_by, description, receiver }) => ({
          category,
          paymentMethod,
          amount,
          created_by,
          description,
          receiver,
          date: new Date(),
        })
      )
    );
    if (error) throw error;
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Processing done');
  }
});

task.fireOnTick();
task.start();

function authClient(email: string, password: string): Promise<User | null> {
  return new Promise(async (res, rej) => {
    const { user, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
    if (error) rej(error);
    res(user);
  });
}

function getSubscriptions(): Promise<ISubscription[] | null> {
  return new Promise(async (res, rej) => {
    const { data, error } = await supabase
      .from<ISubscription>('subscriptions')
      .select('*')
      .eq('execute_at', new Date().getDate());
    if (error) rej(error);
    res(data);
  });
}
