const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const branch = await prisma.branch.upsert({
    where: { code: 'HQ' },
    update: {},
    create: { name: 'Headquarters', code: 'HQ', address: 'The Edifying Assembly', email: 'info@theedifyingassembly.org' }
  });
  const email = process.env.DEFAULT_SUPER_ADMIN_EMAIL || 'admin@theedifyingassembly.org';
  const password = process.env.DEFAULT_SUPER_ADMIN_PASSWORD || 'ChangeMe@12345';
  await prisma.user.upsert({
    where: { email }, update: {},
    create: { name: 'System Administrator', email, passwordHash: await bcrypt.hash(password, 12), role: 'SUPER_ADMIN', branchId: branch.id }
  });
  const types = [
    { name:'Believers Training', shortCode:'BT', isEntryLevel:true, canPromoteTo:'WIT,SOD' },
    { name:'Discipleship Training', shortCode:'DT', isEntryLevel:true, canPromoteTo:'WIT,SOD' },
    { name:'Workers in Training', shortCode:'WIT', isEntryLevel:false, canBePromotedFrom:'BT,DT' },
    { name:'School of Discipleship', shortCode:'SOD', isEntryLevel:false, canBePromotedFrom:'BT,DT' }
  ];
  for (const t of types) await prisma.trainingType.upsert({ where:{ shortCode:t.shortCode }, update:{}, create:t });
  const allTypes = await prisma.trainingType.findMany();
  for (const t of allTypes) {
    const code = t.shortCode === 'BT' || t.shortCode === 'DT' ? 'L1' : 'P1';
    await prisma.trainingLevel.upsert({
      where: { trainingTypeId_levelCode: { trainingTypeId: t.id, levelCode: code } },
      update: {},
      create: { trainingTypeId: t.id, name: code === 'L1' ? 'Level 1' : 'Phase 1', levelCode: code, levelOrder: 1, requiredPassedExams: 1, passMark: 60, certificateRequired: true }
    });
  }
  await prisma.sermonLink.create({ data: { title: 'The Edifying Assembly Sermons', minister: 'The Edifying Assembly', sermonUrl: 'https://www.theedifyingassembly.com/sermons' } }).catch(()=>{});
}
main().finally(async()=>prisma.$disconnect());
