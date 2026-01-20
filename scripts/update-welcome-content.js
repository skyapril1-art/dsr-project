import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function updateWelcomeContent() {
  try {
    console.log('📝 환영 메시지를 수정합니다...\n');

    // 1. 환영 메시지 제목 수정
    const titleUpdate = await prisma.siteContent.update({
      where: { key: 'welcome_title' },
      data: {
        title: '환영 메시지 제목',
        content: '동서로교회에 오신 것을 진심으로 환영합니다'
      }
    });
    console.log(`✅ 제목 수정 완료: "${titleUpdate.content}"`);

    // 2. 환영 메시지 내용 수정
    const messageUpdate = await prisma.siteContent.update({
      where: { key: 'welcome_message' },
      data: {
        title: '환영 메시지 내용',
        content: '동서로교회는 하나님의 말씀을 중심으로 예배하고, 서로 사랑하며 성장하는 신앙 공동체입니다. 누구나 환영받고, 함께 신앙의 여정을 걸어가며, 세상을 향한 빛과 소금의 역할을 감당하는 교회입니다. 여러분을 사랑으로 맞이합니다.'
      }
    });
    console.log(`✅ 내용 수정 완료`);
    console.log(`   "${messageUpdate.content}"`);

    // 3. 수정된 내용 확인
    console.log('\n📋 수정된 환영 메시지:');
    console.log('==========================================');
    const contents = await prisma.siteContent.findMany({
      where: {
        key: {
          in: ['welcome_title', 'welcome_message']
        }
      },
      orderBy: { order: 'asc' }
    });

    contents.forEach(content => {
      console.log(`\n[${content.key}]`);
      console.log(`제목: ${content.title}`);
      console.log(`내용: ${content.content}`);
      console.log(`상태: ${content.isActive ? '✅ 활성화' : '❌ 비활성화'}`);
    });
    console.log('==========================================\n');

    console.log('🎉 환영 메시지가 성공적으로 수정되었습니다!');
    console.log('💡 메인 페이지(http://localhost:3000)를 새로고침하여 확인하세요.');

  } catch (error) {
    console.error('❌ 콘텐츠 수정 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWelcomeContent();
