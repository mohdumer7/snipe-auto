'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function LoginPage() {
  const { publicKey, connect, signMessage } = useWallet();
  const router = useRouter();
  const [challenge, setChallenge] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleRequestChallenge = async () => {
    if (!publicKey) return;
    try {
      const response = await axios.post('/api/auth/challenge', {
        walletAddress: publicKey.toBase58(),
      });
      setChallenge(response.data.challenge);
    } catch (err: any) {
      console.error('Error requesting challenge:', err);
      setError('Failed to request challenge. Please try again.');
    }
  };

  const handleVerifySignature = async () => {
    if (!publicKey || !challenge || !signMessage) return;
    try {
      const encodedMessage = new TextEncoder().encode(challenge);
      const signature = await signMessage(encodedMessage);
      const response = await axios.post('/api/auth/verify', {
        walletAddress: publicKey.toBase58(),
        challenge,
        signature: Buffer.from(signature).toString('base64'),
      });
      const token = response.data.accessToken;
      localStorage.setItem('accessToken', token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error verifying signature:', err);
      setError('Failed to verify signature. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Login</h1>
      {!publicKey && (
        <div className="flex flex-col items-center">
          <p className="mb-4">Please connect your wallet to continue.</p>
          <WalletMultiButton className="w-full max-w-xs" />
        </div>
      )}
      {publicKey && !challenge && (
        <button onClick={handleRequestChallenge} className="bg-blue-500 text-white px-4 py-2 rounded">
          Request Challenge
        </button>
      )}
      {challenge && (
        <button onClick={handleVerifySignature} className="bg-purple-500 text-white px-4 py-2 rounded">
          Verify Signature & Login
        </button>
      )}
      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
