import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json(
      { error: 'Wallet query parameter is required' },
      { status: 400 }
    );
  }

  // Forward request to the NestJS backend.
  const backendUrl = `http://localhost:8000/tokens?wallet=${wallet}`;

  try {
    const res = await fetch(backendUrl);
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }
    const data = await res.json();

    // Ensure tokens are returned at the top level.
    return NextResponse.json({ tokens: data.tokens });
  } catch (error) {
    console.error('Error in /api/tokens route:', error);
    return NextResponse.json({ tokens: [] }, { status: 500 });
  }
}
