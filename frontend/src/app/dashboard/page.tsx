'use client';

import { NextPage } from 'next';
import useSWR from 'swr';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Dashboard: NextPage = () => {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const swrKey = publicKey ? `/api/tokens?wallet=${publicKey.toBase58()}` : null;
  const { data, error } = useSWR(swrKey, fetcher, { refreshInterval: 5000 });

  const tokens = data?.tokens || [];
  const filteredTokens = tokens.filter((token: any) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      {!publicKey && (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-lg">Please connect your wallet to view token analytics.</p>
          <WalletMultiButton className="w-full max-w-xs" />
        </div>
      )}

      {publicKey && (
        <>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md rounded border p-2"
            />
          </div>
          {error && <p className="text-red-500">Error loading token data.</p>}
          {!error && !data && <p>Loading token data...</p>}
          {data && (
            <>
              {filteredTokens.length > 0 ? (
                <div className="space-y-4">
                  {filteredTokens.map((token: any) => (
                    <Card key={token.mintAddress}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                          <h2 className="text-xl font-semibold">{token.name}</h2>
                          <p className="text-sm">Source: {token.source}</p>
                          <p className="text-sm">Liquidity: {token.liquidity}</p>
                          <p className="text-sm">Market Cap: {token.marketCap}</p>
                          <div className="mt-2 flex items-center space-x-2">
                            {token.rugRisk && <span title="Rug Risk">⚠️</span>}
                            {token.scamPotential && <span title="Scam Potential">🚨</span>}
                            {token.bluechip && <span title="Bluechip">💎</span>}
                          </div>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-2">
                          <Button onClick={() => router.push(`/trade/${token.mintAddress}`)}>
                            Trade
                          </Button>
                          <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => router.push(`/token/${token.mintAddress}`)}>
                            Details
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p>No tokens found. Adjust your search criteria or check back later.</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
