import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function fixWelcomeContent() {
  try {
    console.log('🔍 현재 콘텐츠 확인 중...\n');

    const contents = await prisma.siteContent.findMany({
      where: {
        key: {
          in: ['welcome_title', 'welcome_message']
        }
      },
      orderBy: { order: 'asc' }
    });

    console.log('📋 현재 저장된 데이터:');
    console.log('==========================================');
    contents.forEach(content => {
      console.log(`\n[${content.key}]`);
      console.log(`제목: ${content.title}`);
      console.log(`내용: ${content.content}`);
    });
    console.log('\n==========================================\n');

    console.log('✏️ 올바른 내용으로 수정 중...\n');

    // welcome_title: 짧은 제목만
    await prisma.siteContent.update({
      where: { key: 'welcome_title' },
      data: {
        title: '환영 메시지 제목',
        content: '동서로교회에 오신 것을 진심으로 환영합니다'
      }
    });
    console.log('✅ welcome_title 수정 완료: "동서로교회에 오신 것을 진심으로 환영합니다"');

    // welcome_message: 긴 설명 내용
    await prisma.siteContent.update({
      where: { key: 'welcome_message' },
      data: {
        title: '환영 메시지 내용',
        content: '동서로교회는 하나님의 말씀을 중심으로 예배하고, 서로 사랑하며 성장하는 신앙 공동체입니다. 누구나 환영받고, 함께 신앙의 여정을 걸어가며, 세상을 향한 빛과 소금의 역할을 감당하는 교회입니다. 여러분을 사랑으로 맞이합니다.'
      }
    });
    console.log('✅ welcome_message 수정 완료: 긴 환영 메시지 내용\n');

    // 수정 후 확인
    const updatedContents = await prisma.siteContent.findMany({
      where: {
        key: {
          in: ['welcome_title', 'welcome_message']
        }
      },
      orderBy: { order: 'asc' }
    });

    console.log('📋 수정된 데이터:');
    console.log('==========================================');
    updatedContents.forEach(content => {
      console.log(`\n[${content.key}]`);
      console.log(`제목: ${content.title}`);
      console.log(`내용: ${content.content}`);
    });
    console.log('\n==========================================\n');

    console.log('🎉 수정 완료!');
    console.log('💡 메인 페이지(http://localhost:3000)를 새로고침하여 확인하세요.');

  } catch (error) {
    console.error('❌ 수정 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixWelcomeContent();
