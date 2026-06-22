export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid sign-in request.' }, { status: 400 });
  }

  const email = String(body.email || '').trim().toLowerCase();
  const password = String(body.password || '');

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user?.active && await verifyPassword(password, user.passwordHash);

  if (!valid) {
    return NextResponse.json({ error: 'Invalid sign-in details or inactive account.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true, redirectTo: '/dashboard' });
  await createSession(user, req, response);
  return response;
}
