import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;

export const MNEMONIC = 'test test test test test test test test test test test junk';
export const PROJECT_ID = '274a1607-b2d4-4b1f-bf29-871a45adb10e';
