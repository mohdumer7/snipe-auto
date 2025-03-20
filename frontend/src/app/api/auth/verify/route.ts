import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { walletAddress, challenge, signature } = body;
  if (!walletAddress || !challenge || !signature) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  // In production, verify the signature using on-chain or server-side libraries.
  // Here, we simulate a successful verification.
  const accessToken = `dummy-jwt-token-for-${walletAddress}`;
  return NextResponse.json({ accessToken });
}
