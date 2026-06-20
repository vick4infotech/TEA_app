import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

const cookieName = 'tea_session';
const key = new TextEncoder().encode(process.env.JWT_SECRET || 'local-development-secret-change-me');

export async function hashPassword(password) { return bcrypt.hash(password, 12); }
export async function verifyPassword(password, hash) { return bcrypt.compare(password, hash); }

export async function createSession(user) {
  const token = await new SignJWT({ id:user.id, role:user.role, branchId:user.branchId, name:user.name, email:user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(key);
  cookies().set(cookieName, token, { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', path:'/', maxAge:60*60*12 });
}

export function clearSession() { cookies().delete(cookieName); }

export async function getSession() {
  const token = cookies().get(cookieName)?.value;
  if (!token) return null;
  try { const { payload } = await jwtVerify(token, key); return payload; } catch { return null; }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.id) return null;
  const user = await prisma.user.findUnique({ where:{ id:String(session.id) }, include:{ branch:true } });
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

export function canAccess(user, allowed) { return allowed.includes(user.role); }

export function branchWhere(user, field='branchId') {
  if (user.role === 'SUPER_ADMIN' || user.role === 'SUPER_TRAINING_COORDINATOR') return {};
  return user.branchId ? { [field]: user.branchId } : { [field]: '__none__' };
}
