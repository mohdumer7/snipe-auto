'use client';

import { NextPage } from 'next';
import { useWallet } from '@solana/wallet-adapter-react';
import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useState } from 'react';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Dashboard: NextPage = () => {
  const { publicKey, connect } = useWallet();
  const [actionableTokens, setActionableTokens] = useState<any[]>([]);
  const { data, error } = useSWR(
    publicKey ? `/token?wallet=${publicKey.toBase58()}` : null,
    fetcher,
    { refreshInterval: 5000 }
  );

  useEffect(() => {
    if (data && data.tokens) {
      // Filter tokens based on your criteria. 
      // For demonstration, tokens with liquidity less than 50 are "actionable"
      const tokens = data.tokens.filter((token: any) => token.liquidity < 50);
      setActionableTokens(tokens);
    }
  }, [data]);

  if (!publicKey) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Please Connect Your Wallet</h1>
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => connect?.()}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (error) return <div>Error loading tokens.</div>;
  if (!data) return <div>Loading tokens...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {actionableTokens.length > 0 ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Actionable Tokens</h2>
          <ul>
            {actionableTokens.map((token: any) => (
              <li key={token.mintAddress} className="p-2 border-b">
                <span className="font-semibold">{token.name}</span> – Source: {token.source} – Liquidity: {token.liquidity} – Market Cap: {token.marketCap}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>No actionable tokens at this time.</div>
      )}
    </div>
  );
};

export default Dashboard;
