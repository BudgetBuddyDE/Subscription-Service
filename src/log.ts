import dotenv from 'dotenv';
dotenv.config();
import { Client } from '@kleithor/logger';

export const logger = new Client(process.env.LOG_DATABASE_URL as string, {
    application: 'Subscription-Service',
});
