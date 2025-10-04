import { ADMIN_PRIVATE_KEY, NETWORK_URL } from '../config';
import { HttpClient, ThorClient, VeChainPrivateKeySigner, VeChainProvider } from '@vechain/sdk-network';
import { EcoEarnABI, VeCareABI } from '@utils/const';
import { ECO_SOL_ABI, VECARE_SOL_ABI, config } from '@repo/config-contract';

export const thor = new ThorClient(new HttpClient(NETWORK_URL), {
  isPollingEnabled: false,
});

const signer = new VeChainPrivateKeySigner(Buffer.from(ADMIN_PRIVATE_KEY), new VeChainProvider(thor));

export const ecoEarnContract = thor.contracts.load(
  config.CONTRACT_ADDRESS,
  ECO_SOL_ABI,
  signer,
);

export const veCareContract = thor.contracts.load(
  config.VECARE_CONTRACT_ADDRESS,
  VECARE_SOL_ABI,
  signer,
);
