export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
export async function POST(req){
 const { studentCode, phone } = await req.json();
 const record=await prisma.studentTrainingRecord.findUnique({ where:{ studentCode }, include:{ member:true, branch:true, trainingType:true, trainingLevel:true, trainingSet:true, scores:{orderBy:{dateEntered:'desc'},take:1}, certificates:true } });
 if(!record) return NextResponse.json({error:'Result not found'},{status:404});
 if(phone && record.member.phone.replace(/\D/g,'').slice(-7)!==phone.replace(/\D/g,'').slice(-7)) return NextResponse.json({error:'Result not found'},{status:404});
 const latest=record.scores[0];
 return NextResponse.json({
  studentName: record.member.fullName,
  branch: record.branch.name,
  trainingType: record.trainingType.name,
  trainingLevel: record.trainingLevel.name,
  trainingSet: record.trainingSet.name,
  latestFinalScore: latest?.finalScore ?? null,
  passStatus: latest?.passStatus ?? null,
  passedExamsCount: record.passedExamsCount,
  requiredExamsCount: record.requiredExamsCount,
  trainingStatus: record.currentStatus,
  certificateAvailable: record.certificateGenerated,
  certificateId: record.certificates[0]?.certificateId ?? null
 });
}
