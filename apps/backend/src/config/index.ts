import { config } from 'dotenv';
import { mnemonic } from '@vechain/sdk-core';
import { ValidateEnv } from '@utils/validateEnv';

// Load .env files only if they exist (can be disabled by setting SKIP_DOTENV=true)
if (!process.env.SKIP_DOTENV) {
  config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
}

const validatedEnv = ValidateEnv();

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, LOG_FORMAT, LOG_DIR, ORIGIN } = validatedEnv;

export const { OPENAI_API_KEY } = validatedEnv;
export const { MAX_FILE_SIZE } = validatedEnv;
export const { ADMIN_MNEMONIC, ADMIN_ADDRESS } = validatedEnv;
export const { NETWORK_URL, NETWORK_TYPE } = validatedEnv;
export const { REWARD_AMOUNT } = validatedEnv;
export const { PINATA_API_KEY, PINATA_API_SECRET, PINATA_GATEWAY } = validatedEnv;

// Support both mnemonic and private key
export const ADMIN_PRIVATE_KEY = validatedEnv.ADMIN_PRIVATE_KEY 
  ? validatedEnv.ADMIN_PRIVATE_KEY 
  : (validatedEnv.ADMIN_MNEMONIC ? mnemonic.derivePrivateKey(validatedEnv.ADMIN_MNEMONIC.split(' ')) : '');
