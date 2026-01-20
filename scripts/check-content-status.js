import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function checkContentStatus() {
  try {
    console.log('🔍 현재 콘텐츠 상태 확인...\n');

    const contents = await prisma.siteContent.findMany({
      where: {
        key: {
          in: ['welcome_title', 'welcome_message']
        }
      },
      orderBy: { order: 'asc' }
    });

    console.log('📋 데이터베이스 상태:');
    console.log('==========================================');
    contents.forEach(content => {
      console.log(`\nID: ${content.id}`);
      console.log(`Key: ${content.key}`);
      console.log(`제목: ${content.title}`);
      console.log(`내용: ${content.content.substring(0, 50)}...`);
      console.log(`활성화: ${content.isActive ? '✅ YES' : '❌ NO'}`);
      console.log(`순서: ${content.order}`);
    });
    console.log('\n==========================================');

  } catch (error) {
    console.error('❌ 확인 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkContentStatus();
