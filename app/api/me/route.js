export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireUser } from '@/lib/auth';

export async function GET(){
  try {
    const user=await requireUser();
    return NextResponse.json({id:user.id,name:user.name,email:user.email,role:user.role,branchId:user.branchId});
  } catch (e) {
    return NextResponse.json({error:'Unauthorized'},{status:401});
  }
}
