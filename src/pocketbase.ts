import Client from 'pocketbase';
import {logger} from './logger';

const PocketBase: Client = require('pocketbase/cjs');

const {POCKETBASE_URL} = process.env;
if (!POCKETBASE_URL) throw new Error('POCKETBASE_URL is not set');

// @ts-expect-error
export const pb: Client = new PocketBase(POCKETBASE_URL as string);

pb.authStore.onChange((token, model) => {
  logger.info('Pocketbase auth-store changed! Token {token}', {
    token,
    model,
  });
});
