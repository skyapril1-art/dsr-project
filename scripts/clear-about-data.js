const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('기존 AboutContent 데이터 삭제 중...');
  
  await prisma.aboutContent.deleteMany({});
  
  console.log('✅ 모든 데이터 삭제 완료!');
}

main()
  .catch((e) => {
    console.error('오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
