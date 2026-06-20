export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { studentCode } from '@/lib/codegen';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

function value(row, ...keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') return String(row[key]).trim();
  }
  return '';
}

function parse(fileName, buffer) {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    return XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' });
  }
  return Papa.parse(buffer.toString('utf8'), { header: true, skipEmptyLines: true }).data;
}

export async function POST(req) {
  try {
    const user = await requireUser();
    const form = await req.formData();
    const file = form.get('file');
    if (!file) throw new Error('Upload file is required');

    const rows = parse(file.name, Buffer.from(await file.arrayBuffer()));
    const errors = [];
    let created = 0;

    for (const [index, row] of rows.entries()) {
      try {
        const identifier = value(row, 'Existing member identifier', 'memberId', 'phone');
        const member = await prisma.member.findFirst({ where: { OR: [{ id: identifier }, { phone: identifier }] } });
        if (!member) throw new Error('Existing member not found');
        if (!user.role.startsWith('SUPER') && member.branchId !== user.branchId) throw new Error('Branch access denied');

        const typeCode = value(row, 'Training type', 'trainingType');
        const levelCode = value(row, 'Training level', 'trainingLevel');
        const setName = value(row, 'Training set', 'trainingSet');

        const type = await prisma.trainingType.findFirst({ where: { OR: [{ shortCode: typeCode.toUpperCase() }, { name: typeCode }] } });
        if (!type) throw new Error('Training type not found');
        if (!type.isEntryLevel) throw new Error('Students can only begin from BT or DT');

        const level = await prisma.trainingLevel.findFirst({ where: { trainingTypeId: type.id, OR: [{ levelCode: levelCode.toUpperCase() }, { name: levelCode }] } });
        if (!level) throw new Error('Training level not found');

        const set = await prisma.trainingSet.findFirst({ where: { trainingTypeId: type.id, trainingLevelId: level.id, branchId: member.branchId, name: setName } });
        if (!set) throw new Error('Training set not found');

        const active = await prisma.studentTrainingRecord.findFirst({ where: { memberId: member.id, currentStatus: 'ACTIVE' } });
        if (active) throw new Error('Member is already in an active training set');

        await prisma.studentTrainingRecord.create({
          data: {
            memberId: member.id,
            branchId: member.branchId,
            trainingTypeId: type.id,
            trainingLevelId: level.id,
            trainingSetId: set.id,
            studentCode: await studentCode(member.branchId, type.id, level.id),
            requiredExamsCount: level.requiredPassedExams
          }
        });
        created += 1;
      } catch (e) {
        errors.push({ row: index + 2, error: e.message });
      }
    }

    return NextResponse.json({ created, errors, total: rows.length });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: e.message === 'Unauthorized' ? 401 : 400 });
  }
}
