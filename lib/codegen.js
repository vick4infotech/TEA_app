import { prisma } from './db';

export async function studentCode(branchId, trainingTypeId, trainingLevelId) {
  const [branch, type, level] = await Promise.all([
    prisma.branch.findUnique({ where: { id: branchId } }),
    prisma.trainingType.findUnique({ where: { id: trainingTypeId } }),
    prisma.trainingLevel.findUnique({ where: { id: trainingLevelId } })
  ]);
  if (!branch) throw new Error('Branch is required');
  if (!type) throw new Error('Training type is required');
  if (!level) throw new Error('Training level is required');
  const year = new Date().getFullYear();
  const count = await prisma.studentTrainingRecord.count({ where: { branchId, trainingTypeId, trainingLevelId } }) + 1;
  return `TEA-${String(branch.code).toUpperCase()}-${String(type.shortCode).toUpperCase()}-${String(level.levelCode).toUpperCase()}-${year}-${String(count).padStart(4, '0')}`;
}

export async function certificateCode(trainingTypeId) {
  const type = await prisma.trainingType.findUnique({ where: { id: trainingTypeId } });
  if (!type) throw new Error('Training type is required');
  const year = new Date().getFullYear();
  const prefix = `TEA-CERT-${String(type.shortCode).toUpperCase()}-${year}`;
  const count = await prisma.certificate.count({ where: { certificateId: { contains: prefix } } }) + 1;
  return `${prefix}-${String(count).padStart(4, '0')}`;
}
