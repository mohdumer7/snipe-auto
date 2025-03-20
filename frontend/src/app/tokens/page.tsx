'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNotifications, NotificationData } from '@/hooks/useNotifications';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function TokensPage() {
  const { publicKey } = useWallet();
  const router = useRouter();
  const [tokens, setTokens] = useState<any[]>([]);
  const notifications = useNotifications();

  // Fetch initial tokens data using SWR
  const swrKey = publicKey ? `/api/tokens?wallet=${publicKey.toBase58()}` : null;
  const { data, error } = useSWR(swrKey, fetcher, { refreshInterval: 5000 });

  // When initial data arrives, update state.
  useEffect(() => {
    if (data && data.tokens) {
      setTokens(data.tokens);
    }
  }, [data]);

  // Merge incoming WebSocket token updates into our tokens state.
  useEffect(() => {
    if (notifications.length) {
      setTokens((prevTokens) => {
        const updatedTokens = [...prevTokens];
        notifications.forEach((notif: NotificationData) => {
          if (notif.type === 'tokenUpdate' && notif.data) {
            const index = updatedTokens.findIndex(
              (t) => t.mintAddress === notif.data.mintAddress
            );
            if (index !== -1) {
              updatedTokens[index] = notif.data;
            } else {
              updatedTokens.unshift(notif.data);
            }
          }
        });
        return updatedTokens;
      });
    }
  }, [notifications]);

  // Group tokens based on launchProgress
  const newTokens = tokens.filter((token) => token.launchProgress < 80);
  const graduatingTokens = tokens.filter(
    (token) => token.launchProgress >= 80 && token.launchProgress < 100
  );
  const graduatedTokens = tokens.filter((token) => token.launchProgress >= 100);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Token Updates</h1>

      {!publicKey && (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-lg">Please connect your wallet to see token updates.</p>
        </div>
      )}

      {publicKey && (
        <>
          {error && <p className="text-red-500">Error loading tokens.</p>}
          {!error && tokens.length === 0 && <p>Loading tokens...</p>}

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">New Tokens</h2>
            {newTokens.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {newTokens.map((token) => (
                  <Card key={token.mintAddress}>
                    <h3 className="text-xl font-bold">{token.name}</h3>
                    <p className="text-sm">Mint: {token.mintAddress}</p>
                    <p className="text-sm">Source: {token.source}</p>
                    <p className="text-sm">Liquidity: {token.liquidity}</p>
                    <p className="text-sm">Market Cap: {token.marketCap}</p>
                    <p className="text-sm">Launch Progress: {token.launchProgress}%</p>
                    <div className="mt-2 flex items-center space-x-2">
                      {token.rugRisk && <span title="Rug Risk">⚠️</span>}
                      {token.scamPotential && <span title="Scam Potential">🚨</span>}
                      {token.bluechip && <span title="Bluechip">💎</span>}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button onClick={() => router.push(`/trade/${token.mintAddress}`)}>
                        Trade
                      </Button>
                      <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => router.push(`/token/${token.mintAddress}`)}>
                        Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No new tokens available.</p>
            )}
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold">Graduating Tokens</h2>
            {graduatingTokens.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {graduatingTokens.map((token) => (
                  <Card key={token.mintAddress}>
                    <h3 className="text-xl font-bold">{token.name}</h3>
                    <p className="text-sm">Mint: {token.mintAddress}</p>
                    <p className="text-sm">Source: {token.source}</p>
                    <p className="text-sm">Liquidity: {token.liquidity}</p>
                    <p className="text-sm">Market Cap: {token.marketCap}</p>
                    <p className="text-sm">Launch Progress: {token.launchProgress}%</p>
                    <div className="mt-2 flex items-center space-x-2">
                      {token.rugRisk && <span title="Rug Risk">⚠️</span>}
                      {token.scamPotential && <span title="Scam Potential">🚨</span>}
                      {token.bluechip && <span title="Bluechip">💎</span>}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button onClick={() => router.push(`/trade/${token.mintAddress}`)}>
                        Trade
                      </Button>
                      <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => router.push(`/token/${token.mintAddress}`)}>
                        Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No graduating tokens available.</p>
            )}
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold">Graduated Tokens</h2>
            {graduatedTokens.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {graduatedTokens.map((token) => (
                  <Card key={token.mintAddress}>
                    <h3 className="text-xl font-bold">{token.name}</h3>
                    <p className="text-sm">Mint: {token.mintAddress}</p>
                    <p className="text-sm">Source: {token.source}</p>
                    <p className="text-sm">Liquidity: {token.liquidity}</p>
                    <p className="text-sm">Market Cap: {token.marketCap}</p>
                    <p className="text-sm">Launch Progress: {token.launchProgress}%</p>
                    <div className="mt-2 flex items-center space-x-2">
                      {token.rugRisk && <span title="Rug Risk">⚠️</span>}
                      {token.scamPotential && <span title="Scam Potential">🚨</span>}
                      {token.bluechip && <span title="Bluechip">💎</span>}
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button onClick={() => router.push(`/trade/${token.mintAddress}`)}>
                        Trade
                      </Button>
                      <Button className="bg-yellow-500 hover:bg-yellow-600" onClick={() => router.push(`/token/${token.mintAddress}`)}>
                        Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No graduated tokens available.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}
