import { NextRequest, NextResponse } from 'next/server';
import { searchStahl } from '@/lib/stahlSearch';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const query = String(body.query || '');
  return NextResponse.json({ result: searchStahl(query, 8000) });
}
