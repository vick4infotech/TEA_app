export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

export async function POST(req) {
  const response = NextResponse.redirect(new URL('/login', req.url), { status: 303 });
  clearSession(req, response);
  return response;
}
