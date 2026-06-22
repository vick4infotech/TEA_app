const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

function clean(value, fallback = '') {
  const text = String(value || '').trim();
  return text || fallback;
}

async function main() {
  const branch = await prisma.branch.upsert({
    where: { code: 'HQ' },
    update: {
      name: 'Headquarters',
      address: 'The Edifying Assembly',
      email: 'info@theedifyingassembly.org',
      status: 'ACTIVE'
    },
    create: {
      name: 'Headquarters',
      code: 'HQ',
      address: 'The Edifying Assembly',
      email: 'info@theedifyingassembly.org',
      status: 'ACTIVE'
    }
  });

  const email = clean(process.env.DEFAULT_SUPER_ADMIN_EMAIL, 'admin@theedifyingassembly.org').toLowerCase();
  const password = clean(process.env.DEFAULT_SUPER_ADMIN_PASSWORD, 'ChangeMe@12345');
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name: 'System Administrator',
      passwordHash,
      role: 'SUPER_ADMIN',
      branchId: branch.id,
      active: true
    },
    create: {
      name: 'System Administrator',
      email,
      passwordHash,
      role: 'SUPER_ADMIN',
      branchId: branch.id,
      active: true
    }
  });

  const types = [
    { name: 'Believers Training', shortCode: 'BT', isEntryLevel: true, canPromoteTo: 'WIT,SOD' },
    { name: 'Discipleship Training', shortCode: 'DT', isEntryLevel: true, canPromoteTo: 'WIT,SOD' },
    { name: 'Workers in Training', shortCode: 'WIT', isEntryLevel: false, canBePromotedFrom: 'BT,DT' },
    { name: 'School of Discipleship', shortCode: 'SOD', isEntryLevel: false, canBePromotedFrom: 'BT,DT' }
  ];

  for (const t of types) {
    await prisma.trainingType.upsert({
      where: { shortCode: t.shortCode },
      update: {
        name: t.name,
        isEntryLevel: t.isEntryLevel,
        canBePromotedFrom: t.canBePromotedFrom || null,
        canPromoteTo: t.canPromoteTo || null,
        status: 'ACTIVE'
      },
      create: t
    });
  }

  const allTypes = await prisma.trainingType.findMany();
  for (const t of allTypes) {
    const code = t.shortCode === 'BT' || t.shortCode === 'DT' ? 'L1' : 'P1';
    await prisma.trainingLevel.upsert({
      where: { trainingTypeId_levelCode: { trainingTypeId: t.id, levelCode: code } },
      update: {
        name: code === 'L1' ? 'Level 1' : 'Phase 1',
        levelOrder: 1,
        requiredPassedExams: 1,
        passMark: 60,
        certificateRequired: true,
        status: 'ACTIVE'
      },
      create: {
        trainingTypeId: t.id,
        name: code === 'L1' ? 'Level 1' : 'Phase 1',
        levelCode: code,
        levelOrder: 1,
        requiredPassedExams: 1,
        passMark: 60,
        certificateRequired: true,
        status: 'ACTIVE'
      }
    });
  }

  const existingSermon = await prisma.sermonLink.findFirst({ where: { sermonUrl: 'https://www.theedifyingassembly.com/sermons' } });
  if (!existingSermon) {
    await prisma.sermonLink.create({
      data: {
        title: 'The Edifying Assembly Sermons',
        minister: 'The Edifying Assembly',
        sermonUrl: 'https://www.theedifyingassembly.com/sermons',
        status: 'ACTIVE'
      }
    });
  }

  console.log(`Administrator access ensured for ${email}`);
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
