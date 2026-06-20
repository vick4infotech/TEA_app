export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
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
        const branchCode = value(row, 'Branch', 'branch');
        const branch = user.role.startsWith('SUPER')
          ? await prisma.branch.findFirst({ where: { OR: [{ code: branchCode.toUpperCase() }, { name: branchCode }] } })
          : await prisma.branch.findUnique({ where: { id: user.branchId } });
        if (!branch) throw new Error('Branch not found');

        const familyName = value(row, 'Family name', 'familyName');
        if (!familyName) throw new Error('Family name is required');

        const fullName = value(row, 'Member full name', 'fullName');
        if (!fullName) throw new Error('Member full name is required');

        const phone = value(row, 'Phone number', 'phone');
        if (!phone) throw new Error('Phone number is required');

        const birthday = value(row, 'Date of birth', 'dateOfBirth');
        const dateOfBirth = new Date(birthday);
        if (Number.isNaN(dateOfBirth.getTime())) throw new Error('Date of birth is required');

        const family = await prisma.family.findFirst({ where: { name: familyName, branchId: branch.id } })
          || await prisma.family.create({ data: { name: familyName, branchId: branch.id } });

        const joined = value(row, 'Date joined', 'dateJoined');
        await prisma.member.create({
          data: {
            fullName,
            gender: (value(row, 'Gender', 'gender') || 'OTHER').toUpperCase(),
            dateOfBirth,
            phone,
            email: value(row, 'Email', 'email') || null,
            branchId: branch.id,
            familyId: family.id,
            dateJoined: joined ? new Date(joined) : null,
            maritalStatus: value(row, 'Marital status', 'maritalStatus') || null,
            occupation: value(row, 'Occupation', 'occupation') || null
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
