const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  const contents = await prisma.aboutContent.findMany({
    orderBy: { order: 'asc' }
  });
  
  console.log('\n=== 현재 AboutContent 데이터 ===\n');
  contents.forEach(c => {
    console.log(`Key: ${c.key}`);
    console.log(`Title: ${c.title}`);
    console.log(`Content:`, c.content);
    console.log(`ImageUrl: ${c.imageUrl}`);
    console.log(`Order: ${c.order}, Active: ${c.isActive}`);
    console.log('---');
  });
  
  console.log(`\n총 ${contents.length}개 항목`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
