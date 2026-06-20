export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyPassword, createSession } from '@/lib/auth';
export async function POST(req){
 const {email,password}=await req.json();
 const user=await prisma.user.findUnique({where:{email}});
 if(!user || !user.active || !(await verifyPassword(password,user.passwordHash))) return NextResponse.json({error:'Unauthorized'},{status:401});
 await createSession(user); return NextResponse.json({ok:true});
}
