import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { walletAddress } = body;
  if (!walletAddress) {
    return NextResponse.json({ error: 'walletAddress is required' }, { status: 400 });
  }
  // For demonstration, generate a dummy challenge.
  const challenge = `Sign this challenge for wallet ${walletAddress}: ${Math.random().toString(36).substring(2)}`;
  return NextResponse.json({ challenge });
}
