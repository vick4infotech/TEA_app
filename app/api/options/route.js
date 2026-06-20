export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser, branchWhere } from '@/lib/auth';

function option(id, label, extra = {}) {
  return { id, label, ...extra };
}

export async function GET() {
  try {
    const user = await requireUser();
    const branchScope = branchWhere(user);
    const superRole = user.role === 'SUPER_ADMIN' || user.role === 'SUPER_TRAINING_COORDINATOR';

    const [branches, families, members, trainingTypes, trainingLevels, trainingSets, students] = await Promise.all([
      prisma.branch.findMany({ where: superRole ? {} : { id: user.branchId || '__none__' }, orderBy: { name: 'asc' } }),
      prisma.family.findMany({ where: branchScope, orderBy: { name: 'asc' } }),
      prisma.member.findMany({ where: { ...branchScope, active: true }, include: { family: true }, orderBy: { fullName: 'asc' }, take: 1000 }),
      prisma.trainingType.findMany({ where: { status: 'ACTIVE' }, orderBy: { shortCode: 'asc' } }),
      prisma.trainingLevel.findMany({ where: { status: 'ACTIVE' }, include: { trainingType: true }, orderBy: [{ trainingTypeId: 'asc' }, { levelOrder: 'asc' }] }),
      prisma.trainingSet.findMany({ where: { ...branchScope, status: 'ACTIVE' }, include: { branch: true, trainingType: true, trainingLevel: true }, orderBy: { startDate: 'desc' }, take: 1000 }),
      prisma.studentTrainingRecord.findMany({ where: branchScope, include: { member: true, trainingType: true, trainingLevel: true }, orderBy: { dateRegistered: 'desc' }, take: 1000 })
    ]);

    const roleOptions = user.role === 'BRANCH_ADMIN'
      ? ['BRANCH_TRAINING_COORDINATOR', 'BRANCH_EVANGELISM_COORDINATOR']
      : ['SUPER_ADMIN', 'SUPER_TRAINING_COORDINATOR', 'BRANCH_ADMIN', 'BRANCH_TRAINING_COORDINATOR', 'BRANCH_EVANGELISM_COORDINATOR'];

    return NextResponse.json({
      branches: branches.map(b => option(b.id, `${b.name} (${b.code})`, { code: b.code })),
      families: families.map(f => option(f.id, f.name, { branchId: f.branchId })),
      members: members.map(m => option(m.id, `${m.fullName} - ${m.phone}`, { branchId: m.branchId, familyId: m.familyId })),
      trainingTypes: trainingTypes.map(t => option(t.id, `${t.shortCode} - ${t.name}`, { shortCode: t.shortCode, isEntryLevel: t.isEntryLevel })),
      trainingLevels: trainingLevels.map(l => option(l.id, `${l.trainingType?.shortCode || ''} - ${l.name}`, { trainingTypeId: l.trainingTypeId, levelCode: l.levelCode })),
      trainingSets: trainingSets.map(s => option(s.id, `${s.name} - ${s.branch?.code || ''}`, { branchId: s.branchId, trainingTypeId: s.trainingTypeId, trainingLevelId: s.trainingLevelId })),
      students: students.map(s => option(s.id, `${s.member?.fullName || 'Student'} - ${s.studentCode}`, { branchId: s.branchId, trainingTypeId: s.trainingTypeId, trainingLevelId: s.trainingLevelId })),
      roles: roleOptions.map(r => option(r, r.replaceAll('_', ' '))),
      genders: ['MALE', 'FEMALE', 'OTHER'].map(g => option(g, g)),
      statuses: ['ACTIVE', 'INACTIVE', 'ARCHIVED', 'COMPLETED', 'DRAFT', 'PUBLISHED'].map(s => option(s, s)),
      membershipStatuses: ['Member', 'Worker', 'First Timer', 'Visitor', 'Inactive'].map(s => option(s, s)),
      maritalStatuses: ['Single', 'Married', 'Widowed', 'Divorced'].map(s => option(s, s)),
      trainingCodes: ['BT', 'DT', 'WIT', 'SOD'].map(s => option(s, s)),
      outreachTypes: ['Monthly Outreach Report', 'Special Outreach Report', 'Street Evangelism', 'Crusade', 'Follow-up Outreach', 'Prayer Outreach', 'Custom Outreach'].map(s => option(s, s))
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 400 });
  }
}
