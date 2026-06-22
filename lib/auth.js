import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

export const cookieName = 'tea_session';
const sessionMaxAge = 60 * 60 * 12;

function getJwtKey() {
  const secret = process.env.JWT_SECRET || 'local-development-secret-change-me';
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function forwardedProto(req) {
  const raw = req?.headers?.get?.('x-forwarded-proto') || '';
  return raw.split(',')[0].trim().toLowerCase();
}

export function shouldUseSecureCookie(req) {
  const setting = String(process.env.SESSION_COOKIE_SECURE || 'auto').trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(setting)) return true;
  if (['false', '0', 'no', 'off'].includes(setting)) return false;

  const proto = forwardedProto(req);
  const forwardedSsl = String(req?.headers?.get?.('x-forwarded-ssl') || '').toLowerCase();
  const requestProtocol = String(req?.nextUrl?.protocol || '').replace(':', '').toLowerCase();
  const appUrl = String(process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || '').trim().toLowerCase();

  return proto === 'https' || forwardedSsl === 'on' || requestProtocol === 'https' || appUrl.startsWith('https://');
}

export function sessionCookieOptions(req, overrides = {}) {
  const options = {
    httpOnly: true,
    sameSite: 'lax',
    secure: shouldUseSecureCookie(req),
    path: '/',
    maxAge: sessionMaxAge,
    ...overrides
  };

  const domain = String(process.env.SESSION_COOKIE_DOMAIN || '').trim();
  if (domain) options.domain = domain;
  return options;
}

export async function createSessionToken(user) {
  return new SignJWT({
    id: user.id,
    role: user.role,
    branchId: user.branchId,
    name: user.name,
    email: user.email
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(getJwtKey());
}

export async function createSession(user, req = null, response = null) {
  const token = await createSessionToken(user);
  const options = sessionCookieOptions(req);

  if (response?.cookies?.set) {
    response.cookies.set(cookieName, token, options);
    return response;
  }

  cookies().set(cookieName, token, options);
  return token;
}

export function clearSession(req = null, response = null) {
  const options = sessionCookieOptions(req, { maxAge: 0, expires: new Date(0) });

  if (response?.cookies?.set) {
    response.cookies.set(cookieName, '', options);
    return response;
  }

  cookies().set(cookieName, '', options);
  return null;
}

export async function getSession() {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getJwtKey());
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.id) return null;

  const user = await prisma.user.findUnique({ where: { id: String(session.id) }, include: { branch: true } });
  if (!user || !user.active) return null;
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requirePageUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export function canAccess(user, allowed) {
  return allowed.includes(user.role);
}

export function branchWhere(user, field = 'branchId') {
  if (user.role === 'SUPER_ADMIN' || user.role === 'SUPER_TRAINING_COORDINATOR') return {};
  return user.branchId ? { [field]: user.branchId } : { [field]: '__none__' };
}
