import apiClient from './apiClient';

export const getTokens = async (wallet: string) => {
  const res = await apiClient.get(`/tokens?wallet=${wallet}`);
  return res.data;
};

export const placeBuyOrder = async (orderData: any) => {
  const res = await apiClient.post('/trade/buy', orderData);
  return res.data;
};

export const placeSellOrder = async (orderData: any) => {
  const res = await apiClient.post('/trade/sell', orderData);
  return res.data;
};

export const getAiSniperConfigs = async () => {
  const res = await apiClient.get('/sniper');
  return res.data;
};

export const createAiSniperConfig = async (configData: any) => {
  const res = await apiClient.post('/sniper/create', configData);
  return res.data;
};

export const requestChallenge = async (walletAddress: string) => {
  const res = await apiClient.post('/auth/challenge', { walletAddress });
  return res.data;
};

export const verifySignature = async (
  walletAddress: string,
  challenge: string,
  signature: string
) => {
  const res = await apiClient.post('/auth/verify', { walletAddress, challenge, signature });
  return res.data;
};
