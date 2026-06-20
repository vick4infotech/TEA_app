import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { certificateCode } from '@/lib/codegen';
import { certificatePdf } from '@/lib/certificatePdf';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req){
 try{
  const user=await requireUser(); const { studentRecordId }=await req.json();
  const record=await prisma.studentTrainingRecord.findUnique({where:{id:studentRecordId},include:{member:true,branch:true,trainingType:true,trainingLevel:true}});
  if(!record) return NextResponse.json({error:'Student record not found'},{status:404});
  if(!['SUPER_ADMIN','SUPER_TRAINING_COORDINATOR'].includes(user.role) && record.branchId!==user.branchId) return NextResponse.json({error:'Forbidden'},{status:403});
  if(record.passedExamsCount < record.requiredExamsCount) return NextResponse.json({error:'Completion requirement not met'},{status:400});
  let cert=await prisma.certificate.findFirst({where:{studentRecordId}});
  if(!cert){ cert=await prisma.certificate.create({data:{certificateId:await certificateCode(record.trainingTypeId),studentRecordId,branchId:record.branchId,issuedBy:user.name}}); await prisma.studentTrainingRecord.update({where:{id:studentRecordId},data:{certificateGenerated:true}}); }
  const pdf=await certificatePdf({record,certificateId:cert.certificateId});
  return new NextResponse(pdf,{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${cert.certificateId}.pdf"`}});
 }catch(e){ return NextResponse.json({error:e.message},{status:e.message==='Unauthorized'?401:400}); }
}
