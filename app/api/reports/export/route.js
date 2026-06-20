import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser, branchWhere } from '@/lib/auth';
import { tablePdf, csvBuffer, excelBuffer } from '@/lib/report';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPER_ROLES = ['SUPER_ADMIN', 'SUPER_TRAINING_COORDINATOR'];
const aliases = {
  members: 'branch-membership',
  member: 'branch-membership',
  'branch-membership': 'branch-membership',
  birthdays: 'birthday',
  birthday: 'birthday',
  families: 'family',
  family: 'family',
  'training-sets': 'training-set',
  'training-set': 'training-set',
  students: 'student-performance',
  'student-performance': 'student-performance',
  'pass-rate': 'pass-rate',
  scores: 'scores',
  attendance: 'attendance',
  outreach: 'evangelism',
  evangelism: 'evangelism',
  certificates: 'certificate-completion',
  'certificate-completion': 'certificate-completion',
  workers: 'worker-list',
  'worker-list': 'worker-list',
  branches: 'branch-comparison',
  'branch-comparison': 'branch-comparison',
  users: 'users',
  'training-types': 'training-types',
  'training-levels': 'training-levels',
  curriculum: 'curriculum',
  sermons: 'sermons'
};

const titles = {
  'branch-membership': 'Branch Membership Report',
  birthday: 'Birthday Report',
  family: 'Family Report',
  'training-set': 'Training Set Report',
  'student-performance': 'Student Performance Report',
  'pass-rate': 'Pass Rate Report',
  scores: 'Score Report',
  attendance: 'Attendance Report',
  evangelism: 'Evangelism Report',
  'certificate-completion': 'Certificate and Completion Report',
  'worker-list': 'Worker List Report',
  'branch-comparison': 'Branch Comparison Report',
  users: 'Users and Roles Report',
  'training-types': 'Training Types Report',
  'training-levels': 'Training Levels Report',
  curriculum: 'Curriculum Report',
  sermons: 'Sermon Links Report'
};

function isSuper(user) { return SUPER_ROLES.includes(user.role); }
function cleanDate(value) { return value instanceof Date ? value.toISOString().slice(0, 10) : value; }
function compact(row) { return Object.fromEntries(Object.entries(row).map(([k, v]) => [k, cleanDate(v)])); }
function param(searchParams, name) { const value = searchParams.get(name); return value && value !== 'all' ? value : null; }
function dateRange(searchParams, field) {
  const from = param(searchParams, 'from') || param(searchParams, 'startDate');
  const to = param(searchParams, 'to') || param(searchParams, 'endDate');
  const month = param(searchParams, 'month');
  const year = param(searchParams, 'year');
  const range = {};
  if (from) range.gte = new Date(from);
  if (to) range.lte = new Date(to);
  if (!from && !to && year && month) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);
    range.gte = start; range.lte = end;
  } else if (!from && !to && year) {
    range.gte = new Date(Number(year), 0, 1);
    range.lte = new Date(Number(year), 11, 31, 23, 59, 59, 999);
  }
  return Object.keys(range).length ? { [field]: range } : {};
}
function branchFilter(user, searchParams) {
  const branchId = param(searchParams, 'branch') || param(searchParams, 'branchId');
  if (isSuper(user)) return branchId ? { branchId } : {};
  return branchWhere(user);
}
function branchModelFilter(user, searchParams) {
  const branchId = param(searchParams, 'branch') || param(searchParams, 'branchId');
  if (isSuper(user)) return branchId ? { id: branchId } : {};
  return user.branchId ? { id: user.branchId } : { id: '__none__' };
}
function trainingFilters(searchParams) {
  return {
    ...(param(searchParams, 'trainingType') || param(searchParams, 'trainingTypeId') ? { trainingTypeId: param(searchParams, 'trainingType') || param(searchParams, 'trainingTypeId') } : {}),
    ...(param(searchParams, 'trainingLevel') || param(searchParams, 'trainingLevelId') ? { trainingLevelId: param(searchParams, 'trainingLevel') || param(searchParams, 'trainingLevelId') } : {}),
    ...(param(searchParams, 'trainingSet') || param(searchParams, 'trainingSetId') ? { trainingSetId: param(searchParams, 'trainingSet') || param(searchParams, 'trainingSetId') } : {}),
    ...(param(searchParams, 'status') ? { currentStatus: param(searchParams, 'status') } : {})
  };
}

async function getRows(report, user, searchParams) {
  const branch = branchFilter(user, searchParams);
  switch (report) {
    case 'branch-membership': {
      const rows = await prisma.member.findMany({ where: { ...branch, ...(param(searchParams, 'status') ? { membershipStatus: param(searchParams, 'status') } : {}), ...dateRange(searchParams, 'createdAt') }, include: { branch: true, family: true }, orderBy: { fullName: 'asc' } });
      return rows.map(m => compact({ Name: m.fullName, Gender: m.gender, Phone: m.phone, Email: m.email, Family: m.family?.name, Branch: m.branch?.name, Status: m.membershipStatus, Active: m.active ? 'Yes' : 'No', Birthday: m.dateOfBirth, Joined: m.dateJoined }));
    }
    case 'birthday': {
      const rows = await prisma.member.findMany({ where: { ...branch, active: true }, include: { branch: true, family: true }, orderBy: { fullName: 'asc' } });
      return rows.map(m => compact({ Name: m.fullName, Family: m.family?.name, Phone: m.phone, Branch: m.branch?.name, Birthday: m.dateOfBirth }));
    }
    case 'family': {
      const rows = await prisma.family.findMany({ where: branch, include: { branch: true, _count: { select: { members: true } } }, orderBy: { name: 'asc' } });
      return rows.map(f => compact({ Family: f.name, Branch: f.branch?.name, Head: f.familyHead, Phone: f.phone, Email: f.email, Address: f.address, Members: f._count.members }));
    }
    case 'training-set': {
      const where = { ...branch, ...(param(searchParams, 'status') ? { status: param(searchParams, 'status') } : {}), ...(param(searchParams, 'trainingType') || param(searchParams, 'trainingTypeId') ? { trainingTypeId: param(searchParams, 'trainingType') || param(searchParams, 'trainingTypeId') } : {}), ...(param(searchParams, 'trainingLevel') || param(searchParams, 'trainingLevelId') ? { trainingLevelId: param(searchParams, 'trainingLevel') || param(searchParams, 'trainingLevelId') } : {}) };
      const rows = await prisma.trainingSet.findMany({ where, include: { branch: true, trainingType: true, trainingLevel: true, _count: { select: { students: true } } }, orderBy: { startDate: 'desc' } });
      return rows.map(s => compact({ Set: s.name, Branch: s.branch?.name, Type: s.trainingType?.shortCode, Level: s.trainingLevel?.name, Session: s.sessionYear, Status: s.status, Students: s._count.students, Start: s.startDate, ExpectedEnd: s.expectedEndDate }));
    }
    case 'student-performance':
    case 'pass-rate': {
      const rows = await prisma.studentTrainingRecord.findMany({ where: { ...branch, ...trainingFilters(searchParams), ...dateRange(searchParams, 'dateRegistered') }, include: { member: true, branch: true, trainingType: true, trainingLevel: true, trainingSet: true }, orderBy: { dateRegistered: 'desc' } });
      return rows.map(s => compact({ Student: s.member?.fullName, StudentCode: s.studentCode, Branch: s.branch?.name, Type: s.trainingType?.shortCode, Level: s.trainingLevel?.name, Set: s.trainingSet?.name, LatestScore: s.latestScore, PassedExams: s.passedExamsCount, RequiredExams: s.requiredExamsCount, Status: s.currentStatus, EligibleForPromotion: s.eligibleForPromotion ? 'Yes' : 'No', CertificateGenerated: s.certificateGenerated ? 'Yes' : 'No', Registered: s.dateRegistered }));
    }
    case 'scores': {
      const recordWhere = { ...branch, ...trainingFilters(searchParams) };
      const rows = await prisma.score.findMany({ where: { studentRecord: { is: recordWhere }, ...dateRange(searchParams, 'dateOfExam') }, include: { studentRecord: { include: { member: true, branch: true, trainingType: true, trainingLevel: true, trainingSet: true } }, enteredBy: true }, orderBy: { dateOfExam: 'desc' } });
      return rows.map(s => compact({ Student: s.studentRecord?.member?.fullName, StudentCode: s.studentRecord?.studentCode, Branch: s.studentRecord?.branch?.name, Type: s.studentRecord?.trainingType?.shortCode, Level: s.studentRecord?.trainingLevel?.name, Set: s.studentRecord?.trainingSet?.name, Exam: s.examNumber, Score: s.finalScore, PassMark: s.passMark, Status: s.passStatus, ExamDate: s.dateOfExam, EnteredBy: s.enteredBy?.name }));
    }
    case 'attendance': {
      const rows = await prisma.attendance.findMany({ where: { ...branch, ...dateRange(searchParams, 'attendanceDate') }, include: { branch: true, enteredBy: true }, orderBy: { attendanceDate: 'desc' } });
      return rows.map(a => compact({ Title: a.title, Branch: a.branch?.name, Date: a.attendanceDate, Total: a.totalPersons, FirstTimers: a.firstTimers, Children: a.children, Men: a.men, Women: a.women, EnteredBy: a.enteredBy?.name, Notes: a.notes }));
    }
    case 'evangelism': {
      const rows = await prisma.outreachReport.findMany({ where: { ...branch, ...(param(searchParams, 'reportType') ? { reportType: param(searchParams, 'reportType') } : {}), ...dateRange(searchParams, 'startDate') }, include: { branch: true, enteredBy: true }, orderBy: { startDate: 'desc' } });
      return rows.map(o => compact({ Title: o.title, Type: o.reportType, Branch: o.branch?.name, StartDate: o.startDate, EndDate: o.endDate, Reached: o.numberReached, FirstTimers: o.firstTimers, Saved: o.numberSaved, Supernaturals: o.supernaturalsRecorded, JointPrayers: o.jointPrayers, Location: o.location, EnteredBy: o.enteredBy?.name }));
    }
    case 'certificate-completion': {
      const rows = await prisma.certificate.findMany({ where: branch, include: { branch: true, studentRecord: { include: { member: true, trainingType: true, trainingLevel: true } } }, orderBy: { issuedAt: 'desc' } });
      return rows.map(c => compact({ CertificateId: c.certificateId, Student: c.studentRecord?.member?.fullName, Branch: c.branch?.name, Type: c.studentRecord?.trainingType?.shortCode, Level: c.studentRecord?.trainingLevel?.name, IssuedAt: c.issuedAt, IssuedBy: c.issuedBy }));
    }
    case 'worker-list': {
      const rows = await prisma.studentTrainingRecord.findMany({ where: { ...branch, currentStatus: 'WORKER' }, include: { member: true, branch: true, trainingType: true, trainingLevel: true, trainingSet: true }, orderBy: { dateRegistered: 'desc' } });
      return rows.map(w => compact({ Worker: w.member?.fullName, Phone: w.member?.phone, Branch: w.branch?.name, Type: w.trainingType?.shortCode, Level: w.trainingLevel?.name, Set: w.trainingSet?.name, StudentCode: w.studentCode }));
    }
    case 'branch-comparison': {
      const branches = await prisma.branch.findMany({ where: branchModelFilter(user, searchParams), orderBy: { name: 'asc' } });
      const rows = [];
      for (const b of branches) {
        const [families, members, students, attendance, outreach, certificates] = await Promise.all([
          prisma.family.count({ where: { branchId: b.id } }),
          prisma.member.count({ where: { branchId: b.id } }),
          prisma.studentTrainingRecord.count({ where: { branchId: b.id } }),
          prisma.attendance.aggregate({ where: { branchId: b.id, ...dateRange(searchParams, 'attendanceDate') }, _sum: { totalPersons: true, firstTimers: true } }),
          prisma.outreachReport.aggregate({ where: { branchId: b.id, ...dateRange(searchParams, 'startDate') }, _sum: { numberReached: true, firstTimers: true, numberSaved: true, supernaturalsRecorded: true, jointPrayers: true } }),
          prisma.certificate.count({ where: { branchId: b.id } })
        ]);
        rows.push({ Branch: b.name, Code: b.code, Families: families, Members: members, Students: students, AttendanceTotal: attendance._sum.totalPersons || 0, AttendanceFirstTimers: attendance._sum.firstTimers || 0, OutreachReach: outreach._sum.numberReached || 0, OutreachFirstTimers: outreach._sum.firstTimers || 0, Saved: outreach._sum.numberSaved || 0, Supernaturals: outreach._sum.supernaturalsRecorded || 0, JointPrayers: outreach._sum.jointPrayers || 0, Certificates: certificates });
      }
      return rows;
    }
    case 'users': {
      if (!['SUPER_ADMIN', 'BRANCH_ADMIN'].includes(user.role)) throw new Error('Forbidden');
      const rows = await prisma.user.findMany({ where: isSuper(user) ? {} : { branchId: user.branchId }, include: { branch: true }, orderBy: { name: 'asc' } });
      return rows.map(u => compact({ Name: u.name, Email: u.email, Role: u.role, Branch: u.branch?.name, Active: u.active ? 'Yes' : 'No', Created: u.createdAt }));
    }
    case 'training-types': {
      const rows = await prisma.trainingType.findMany({ orderBy: { shortCode: 'asc' } });
      return rows.map(t => ({ Name: t.name, Code: t.shortCode, EntryLevel: t.isEntryLevel ? 'Yes' : 'No', PromotedFrom: t.canBePromotedFrom, PromotesTo: t.canPromoteTo, Status: t.status }));
    }
    case 'training-levels': {
      const rows = await prisma.trainingLevel.findMany({ include: { trainingType: true }, orderBy: [{ trainingTypeId: 'asc' }, { levelOrder: 'asc' }] });
      return rows.map(l => ({ Type: l.trainingType?.shortCode, Level: l.name, Code: l.levelCode, Order: l.levelOrder, RequiredPassedExams: l.requiredPassedExams, PassMark: l.passMark, CertificateRequired: l.certificateRequired ? 'Yes' : 'No', Status: l.status }));
    }
    case 'curriculum': {
      const rows = await prisma.curriculum.findMany({ include: { trainingType: true, trainingLevel: true }, orderBy: { createdAt: 'desc' } });
      return rows.map(c => compact({ Title: c.title, Type: c.trainingType?.shortCode, Level: c.trainingLevel?.name, Exam: c.examNumber, ExpectedExamDate: c.expectedExamDate, Status: c.status, File: c.fileUrl, Sermon: c.relatedSermonUrl }));
    }
    case 'sermons': {
      const rows = await prisma.sermonLink.findMany({ include: { trainingType: true, trainingLevel: true, trainingSet: true }, orderBy: { title: 'asc' } });
      return rows.map(s => compact({ Title: s.title, Minister: s.minister, URL: s.sermonUrl, Type: s.trainingType?.shortCode, Level: s.trainingLevel?.name, Set: s.trainingSet?.name, Topic: s.topicOrExamNumber, Date: s.sermonDate, Status: s.status }));
    }
    default:
      throw new Error('Report not found');
  }
}

export async function GET(req){
 try{
  const user = await requireUser();
  const { searchParams } = new URL(req.url);
  const requested = searchParams.get('report') || 'branch-membership';
  const report = aliases[requested] || requested;
  const format = (searchParams.get('format') || 'csv').toLowerCase();
  const rows = await getRows(report, user, searchParams);
  const title = titles[report] || 'Report';
  const fileBase = report.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  if(format === 'pdf') return new NextResponse(await tablePdf(title, rows), { headers: { 'Content-Type':'application/pdf', 'Content-Disposition':`attachment; filename="${fileBase}.pdf"` } });
  if(format === 'xlsx' || format === 'excel') return new NextResponse(excelBuffer(rows, title), { headers: { 'Content-Type':'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition':`attachment; filename="${fileBase}.xlsx"` } });
  if(format === 'csv') return new NextResponse(csvBuffer(rows), { headers: { 'Content-Type':'text/csv; charset=utf-8', 'Content-Disposition':`attachment; filename="${fileBase}.csv"` } });
  return NextResponse.json({ error:'Unsupported export format' }, { status:400 });
 }catch(e){
  const status = e.message === 'Unauthorized' ? 401 : e.message === 'Forbidden' ? 403 : 400;
  return NextResponse.json({error:e.message}, {status});
 }
}
