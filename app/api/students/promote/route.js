export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { studentCode } from '@/lib/codegen';

export async function POST(req) {
  try {
    const user = await requireUser();
    const { studentRecordId, trainingTypeId, trainingLevelId, trainingSetId, reason } = await req.json();

    const current = await prisma.studentTrainingRecord.findUnique({ where: { id: studentRecordId }, include: { trainingType: true, member: true } });
    if (!current) return NextResponse.json({ error: 'Student record not found' }, { status: 404 });
    if (!['SUPER_ADMIN', 'SUPER_TRAINING_COORDINATOR'].includes(user.role) && current.branchId !== user.branchId) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (current.passedExamsCount < current.requiredExamsCount) return NextResponse.json({ error: 'Completion requirement not met' }, { status: 400 });

    const [nextType, nextLevel, nextSet] = await Promise.all([
      prisma.trainingType.findUnique({ where: { id: trainingTypeId } }),
      prisma.trainingLevel.findUnique({ where: { id: trainingLevelId } }),
      prisma.trainingSet.findUnique({ where: { id: trainingSetId } })
    ]);
    if (!nextType || !nextLevel || !nextSet) return NextResponse.json({ error: 'Next training path is required' }, { status: 400 });
    if (nextLevel.trainingTypeId !== nextType.id) return NextResponse.json({ error: 'Training level does not match the selected training type' }, { status: 400 });
    if (nextSet.trainingTypeId !== nextType.id || nextSet.trainingLevelId !== nextLevel.id) return NextResponse.json({ error: 'Training set does not match the selected training path' }, { status: 400 });
    if (nextSet.branchId !== current.branchId) return NextResponse.json({ error: 'Training set must belong to the student branch' }, { status: 400 });

    const fromEntry = ['BT', 'DT'].includes(current.trainingType.shortCode);
    const toWorker = ['WIT', 'SOD'].includes(nextType.shortCode);
    const sameAdvanced = current.trainingType.shortCode === nextType.shortCode && ['WIT', 'SOD'].includes(nextType.shortCode);
    if (!(fromEntry && toWorker) && !sameAdvanced) return NextResponse.json({ error: 'Promotion path is not allowed' }, { status: 400 });

    await prisma.studentTrainingRecord.update({ where: { id: current.id }, data: { currentStatus: 'PROMOTED' } });
    const next = await prisma.studentTrainingRecord.create({
      data: {
        memberId: current.memberId,
        branchId: current.branchId,
        trainingTypeId,
        trainingLevelId,
        trainingSetId,
        studentCode: await studentCode(current.branchId, trainingTypeId, trainingLevelId),
        requiredExamsCount: nextLevel.requiredPassedExams
      }
    });
    await prisma.transferHistory.create({ data: { studentRecordId: next.id, fromTrainingSetId: current.trainingSetId, toTrainingSetId: trainingSetId, reason: reason || 'Promotion' } });
    return NextResponse.json(next);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 400 });
  }
}
