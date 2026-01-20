import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function resetContentStatus() {
  try {
    console.log('🔄 콘텐츠 상태를 초기화합니다...\n');

    // 둘 다 활성화로 설정
    await prisma.siteContent.update({
      where: { key: 'welcome_title' },
      data: { isActive: true }
    });
    console.log('✅ welcome_title → 활성화');

    await prisma.siteContent.update({
      where: { key: 'welcome_message' },
      data: { isActive: true }
    });
    console.log('✅ welcome_message → 활성화');

    // 확인
    const contents = await prisma.siteContent.findMany({
      where: {
        key: { in: ['welcome_title', 'welcome_message'] }
      },
      orderBy: { order: 'asc' }
    });

    console.log('\n📋 현재 상태:');
    console.log('==========================================');
    contents.forEach(content => {
      console.log(`${content.key}: ${content.isActive ? '✅ 활성화' : '❌ 비활성화'}`);
    });
    console.log('==========================================\n');
    console.log('🎉 초기화 완료! 메인 페이지를 새로고침하세요.');

  } catch (error) {
    console.error('❌ 초기화 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetContentStatus();
