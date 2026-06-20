import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { certificatePdf } from '@/lib/certificatePdf';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req){
 const {searchParams}=new URL(req.url); const studentCode=searchParams.get('studentCode');
 const record=await prisma.studentTrainingRecord.findUnique({where:{studentCode},include:{member:true,branch:true,trainingType:true,trainingLevel:true,certificates:true}});
 if(!record || !record.certificateGenerated || !record.certificates.length) return NextResponse.json({error:'Certificate not available'},{status:404});
 const pdf=await certificatePdf({record,certificateId:record.certificates[0].certificateId});
 return new NextResponse(pdf,{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${record.certificates[0].certificateId}.pdf"`}});
}
