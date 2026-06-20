export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { requireUser, canAccess } from '@/lib/auth';
import { getConfig, listRecords, createRecord } from '@/lib/crudHelpers';

export async function GET(req,{params}){
 try{ const user=await requireUser(); const cfg=getConfig(params.resource); if(!canAccess(user,cfg.roles)) return NextResponse.json({error:'Forbidden'},{status:403}); const rows=await listRecords(params.resource,user); return NextResponse.json(rows); }
 catch(e){ return NextResponse.json({error:e.message},{status:e.message==='Unauthorized'?401:400}); }
}
export async function POST(req,{params}){
 try{ const user=await requireUser(); const cfg=getConfig(params.resource); if(!canAccess(user,cfg.roles)) return NextResponse.json({error:'Forbidden'},{status:403}); const row=await createRecord(params.resource,await req.json(),user); return NextResponse.json(row); }
 catch(e){ return NextResponse.json({error:e.message},{status:e.message==='Unauthorized'?401:400}); }
}
