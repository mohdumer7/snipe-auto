export interface IChainService {
    buyToken(userWallet: string, tokenAddress: string, amount: number): Promise<any>;
    sellToken(userWallet: string, tokenAddress: string, amount: number): Promise<any>;
  }
  