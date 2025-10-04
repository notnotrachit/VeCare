import { ADMIN_PRIVATE_KEY, NETWORK_URL } from '../config';
import { HttpClient, ThorClient, VeChainPrivateKeySigner, VeChainProvider } from '@vechain/sdk-network';
import { VECARE_SOL_ABI, config } from '@repo/config-contract';

export const thor = new ThorClient(new HttpClient(NETWORK_URL), {
  isPollingEnabled: false,
});

const signer = new VeChainPrivateKeySigner(Buffer.from(ADMIN_PRIVATE_KEY), new VeChainProvider(thor));

export const veCareContract = thor.contracts.load(
  config.VECARE_CONTRACT_ADDRESS,
  VECARE_SOL_ABI,
  signer,
);
