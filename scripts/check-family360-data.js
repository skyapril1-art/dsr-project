const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('현재 Family360Content 데이터 확인 중...\n');

  const contents = await prisma.family360Content.findMany({
    orderBy: { order: 'asc' }
  });

  console.log(`총 ${contents.length}개 항목:\n`);
  
  contents.forEach(item => {
    console.log(`ID: ${item.id}, Key: ${item.key}, Title: ${item.title}, Order: ${item.order}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
