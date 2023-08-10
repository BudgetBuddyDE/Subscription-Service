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
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import type { TBaseSubscription, TBaseTransaction } from './types';

const task = new CronJob('0 3 * * *', async () => {
  try {
    const authUser = await authClient(process.env.SERVICE_EMAIL!, process.env.SERVICE_PASSWORD!);
    if (!authUser) {
      throw new Error(`Authentification for ${process.env.SERVICE_EMAIL} failed`);
    }

    const subscriptions = await getSubscriptions();
    if (!subscriptions || subscriptions.length === 0) {
      return console.log('No subscription to process'); // No subscriptions to process
    }

    const { error } = await supabase.from('transactions').insert(
      subscriptions.map(
        ({ category, paymentMethod, amount, created_by, description, receiver }) =>
          ({
            category,
            paymentMethod,
            amount,
            created_by,
            description,
            receiver,
            date: new Date(),
          } as TBaseTransaction)
      )
    );
    if (error) throw error;
  } catch (error) {
    console.error(error);
  } finally {
    console.log('Processing done');
  }
});

task.start();

function authClient(email: string, password: string): Promise<User | null> {
  return new Promise(async (res, rej) => {
    const {
      data: { user },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) rej(error);
    res(user);
  });
}

function getSubscriptions(): Promise<TBaseSubscription[] | null> {
  return new Promise(async (res, rej) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('paused', false)
      .eq('execute_at', new Date().getDate());
    if (error) rej(error);
    res(data);
  });
}
