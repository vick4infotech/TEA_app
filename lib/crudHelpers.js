import { prisma } from './db';
import { RESOURCE_CONFIG } from './constants';
import { branchWhere } from './auth';
import { hashPassword } from './auth';
import { studentCode, certificateCode } from './codegen';

const SUPER_ROLES = ['SUPER_ADMIN', 'SUPER_TRAINING_COORDINATOR'];
const INTEGER_FIELDS = new Set([
  'levelOrder', 'requiredPassedExams', 'passMark', 'sessionYear', 'examNumber', 'finalScore',
  'totalPersons', 'firstTimers', 'children', 'men', 'women', 'numberReached', 'numberSaved',
  'supernaturalsRecorded', 'jointPrayers'
]);
const BOOLEAN_FIELDS = new Set(['active', 'isEntryLevel', 'certificateRequired']);
const DATE_FIELDS = new Set([
  'dateOfBirth', 'dateJoined', 'startDate', 'expectedEndDate', 'dateOfExam',
  'expectedExamDate', 'sermonDate', 'attendanceDate', 'endDate'
]);

export function getConfig(resource) {
  const cfg = RESOURCE_CONFIG[resource];
  if (!cfg) throw new Error('Resource not found');
  return cfg;
}

export function readInclude(model) {
  const includes = {
    family: { branch: true, _count: { select: { members: true } } },
    member: { family: true, branch: true },
    trainingLevel: { trainingType: true },
    trainingSet: { trainingType: true, trainingLevel: true, branch: true, _count: { select: { students: true } } },
    studentTrainingRecord: { member: true, branch: true, trainingType: true, trainingLevel: true, trainingSet: true },
    score: { studentRecord: { include: { member: true } }, enteredBy: true },
    attendance: { branch: true, enteredBy: true },
    outreachReport: { branch: true, enteredBy: true },
    certificate: { studentRecord: { include: { member: true, trainingType: true, trainingLevel: true } }, branch: true },
    user: { branch: true },
    sermonLink: { trainingType: true, trainingLevel: true, trainingSet: true },
    curriculum: { trainingType: true, trainingLevel: true }
  };
  return includes[model] ? { include: includes[model] } : {};
}

function isSuper(user) {
  return SUPER_ROLES.includes(user.role);
}

function normalizeString(value) {
  if (value === undefined || value === null) return undefined;
  const text = String(value).trim();
  return text === '' ? undefined : text;
}

function coerceField(field, value) {
  if (value === undefined || value === null || value === '') return undefined;
  if (BOOLEAN_FIELDS.has(field)) {
    if (typeof value === 'boolean') return value;
    return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
  }
  if (INTEGER_FIELDS.has(field)) {
    const number = Number(value);
    if (!Number.isInteger(number)) throw new Error(`${field} must be a whole number`);
    return number;
  }
  if (DATE_FIELDS.has(field) || field.toLowerCase().includes('date')) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error(`${field} must be a valid date`);
    return date;
  }
  return normalizeString(value);
}

function scopedBranchId(user, incomingBranchId) {
  return isSuper(user) ? normalizeString(incomingBranchId) : user.branchId;
}

async function ensureBranchAccess(user, branchId) {
  if (!branchId) return;
  if (!isSuper(user) && branchId !== user.branchId) throw new Error('Branch access denied');
}

async function ensureFamilyBranch(familyId, branchId) {
  if (!familyId) return null;
  const family = await prisma.family.findUnique({ where: { id: familyId } });
  if (!family) throw new Error('Family is required');
  if (branchId && family.branchId !== branchId) throw new Error('Family does not belong to the selected branch');
  return family;
}

async function ensureTrainingSetAlignment(data) {
  if (!data.trainingSetId) return null;
  const set = await prisma.trainingSet.findUnique({ where: { id: data.trainingSetId } });
  if (!set) throw new Error('Training set is required');
  if (data.trainingTypeId && set.trainingTypeId !== data.trainingTypeId) throw new Error('Training set does not match the selected training type');
  if (data.trainingLevelId && set.trainingLevelId !== data.trainingLevelId) throw new Error('Training set does not match the selected training level');
  if (data.branchId && set.branchId !== data.branchId) throw new Error('Training set does not belong to the selected branch');
  return set;
}

export async function createRecord(resource, body, user) {
  const cfg = getConfig(resource);
  const data = {};
  cfg.fields.forEach(field => {
    const value = coerceField(field, body[field]);
    if (value !== undefined) data[field] = value;
  });

  if (cfg.model === 'branch') {
    if (data.code) data.code = String(data.code).trim().toUpperCase();
    if (data.phone !== undefined) data.phone = String(data.phone).trim();
  }

  if (cfg.model === 'user') {
    if (!body.password) throw new Error('Password is required');
    if (user.role === 'BRANCH_ADMIN') {
      if (!['BRANCH_TRAINING_COORDINATOR', 'BRANCH_EVANGELISM_COORDINATOR'].includes(data.role)) {
        throw new Error('Branch Admins can only create branch coordinator accounts');
      }
      data.branchId = user.branchId;
    }
    data.passwordHash = await hashPassword(body.password);
    delete data.password;
  }

  if (['family', 'member', 'trainingSet', 'attendance', 'outreachReport'].includes(cfg.model)) {
    data.branchId = scopedBranchId(user, data.branchId);
    await ensureBranchAccess(user, data.branchId);
  }

  if (cfg.model === 'family') {
    if (!data.branchId) throw new Error('Branch is required');
  }

  if (cfg.model === 'member') {
    if (!data.branchId) throw new Error('Branch is required');
    await ensureFamilyBranch(data.familyId, data.branchId);
    if (data.phone !== undefined) data.phone = String(data.phone).trim();
  }

  if (cfg.model === 'trainingSet') {
    if (!data.branchId) throw new Error('Branch is required');
    const level = await prisma.trainingLevel.findUnique({ where: { id: data.trainingLevelId } });
    if (!level) throw new Error('Training level is required');
    if (level.trainingTypeId !== data.trainingTypeId) throw new Error('Training level does not match the selected training type');
  }

  if (cfg.model === 'attendance' || cfg.model === 'outreachReport') {
    data.enteredById = user.id;
  }

  if (cfg.model === 'curriculum') {
    const level = await prisma.trainingLevel.findUnique({ where: { id: data.trainingLevelId } });
    if (!level) throw new Error('Training level is required');
    if (level.trainingTypeId !== data.trainingTypeId) throw new Error('Training level does not match the selected training type');
  }

  if (cfg.model === 'sermonLink') {
    if (data.trainingLevelId) {
      const level = await prisma.trainingLevel.findUnique({ where: { id: data.trainingLevelId } });
      if (!level) throw new Error('Training level is required');
      if (data.trainingTypeId && level.trainingTypeId !== data.trainingTypeId) throw new Error('Training level does not match the selected training type');
    }
    if (data.trainingSetId) await ensureTrainingSetAlignment(data);
  }

  if (cfg.model === 'studentTrainingRecord') {
    const member = await prisma.member.findUnique({ where: { id: data.memberId } });
    if (!member) throw new Error('Member is required');
    if (!isSuper(user) && member.branchId !== user.branchId) throw new Error('Branch access denied');
    data.branchId = member.branchId;

    const type = await prisma.trainingType.findUnique({ where: { id: data.trainingTypeId } });
    if (!type) throw new Error('Training type is required');
    if (!type.isEntryLevel) throw new Error('Students can only begin from BT or DT');

    const level = await prisma.trainingLevel.findUnique({ where: { id: data.trainingLevelId } });
    if (!level) throw new Error('Training level is required');
    if (level.trainingTypeId !== data.trainingTypeId) throw new Error('Training level does not match the selected training type');

    const set = await ensureTrainingSetAlignment(data);
    if (set && set.branchId !== member.branchId) throw new Error('Training set does not belong to the member branch');

    const active = await prisma.studentTrainingRecord.findFirst({ where: { memberId: data.memberId, currentStatus: 'ACTIVE' } });
    if (active) throw new Error('Member is already in an active training set');

    data.requiredExamsCount = level.requiredPassedExams;
    data.studentCode = await studentCode(data.branchId, data.trainingTypeId, data.trainingLevelId);
  }

  if (cfg.model === 'score') {
    const record = await prisma.studentTrainingRecord.findUnique({ where: { id: data.studentRecordId }, include: { trainingLevel: true } });
    if (!record) throw new Error('Student record is required');
    if (!isSuper(user) && record.branchId !== user.branchId) throw new Error('Branch access denied');

    data.trainingTypeId = record.trainingTypeId;
    data.trainingLevelId = record.trainingLevelId;
    data.trainingSetId = record.trainingSetId;
    data.enteredById = user.id;
    data.passMark = record.trainingLevel.passMark;
    data.passStatus = data.finalScore >= record.trainingLevel.passMark ? 'PASSED' : 'FAILED';

    const score = await prisma.score.create({ data });
    const passed = await prisma.score.count({ where: { studentRecordId: record.id, passStatus: 'PASSED' } });
    await prisma.studentTrainingRecord.update({
      where: { id: record.id },
      data: {
        latestScore: data.finalScore,
        passedExamsCount: passed,
        eligibleForPromotion: passed >= record.requiredExamsCount,
        currentStatus: passed >= record.requiredExamsCount ? 'COMPLETED' : 'ACTIVE'
      }
    });
    return score;
  }

  if (cfg.model === 'certificate') {
    const record = await prisma.studentTrainingRecord.findUnique({ where: { id: data.studentRecordId }, include: { trainingType: true } });
    if (!record) throw new Error('Student record is required');
    if (!isSuper(user) && record.branchId !== user.branchId) throw new Error('Branch access denied');
    if (record.passedExamsCount < record.requiredExamsCount) throw new Error('Completion requirement not met');
    const existing = await prisma.certificate.findFirst({ where: { studentRecordId: record.id } });
    if (existing) return existing;
    const certificate = await prisma.certificate.create({
      data: {
        certificateId: await certificateCode(record.trainingTypeId),
        studentRecordId: record.id,
        branchId: record.branchId,
        issuedBy: user.name
      }
    });
    await prisma.studentTrainingRecord.update({ where: { id: record.id }, data: { certificateGenerated: true } });
    return certificate;
  }


  return prisma[cfg.model].create({ data });
}

export async function listRecords(resource, user) {
  const cfg = getConfig(resource);
  const where = {};
  if (['family', 'member', 'trainingSet', 'studentTrainingRecord', 'attendance', 'outreachReport', 'certificate'].includes(cfg.model)) {
    Object.assign(where, branchWhere(user));
  }
  return prisma[cfg.model]
    .findMany({ where, orderBy: { createdAt: 'desc' }, take: 250, ...readInclude(cfg.model) })
    .catch(() => prisma[cfg.model].findMany({ where, take: 250, ...readInclude(cfg.model) }));
}
