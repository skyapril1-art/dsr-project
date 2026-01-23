const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('중복된 intro_feature 항목 삭제 중...');

  // intro_feature_1, 2, 3 삭제
  const deleteKeys = ['intro_feature_1', 'intro_feature_2', 'intro_feature_3'];
  
  for (const key of deleteKeys) {
    const deleted = await prisma.family360Content.deleteMany({
      where: { key: key }
    });
    console.log(`${key} 삭제됨:`, deleted.count, '개');
  }

  console.log('✅ 삭제 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
