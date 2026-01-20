import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function createInitialContent() {
  try {
    console.log('📝 초기 사이트 콘텐츠를 생성합니다...\n');

    const initialContents = [
      {
        key: 'welcome_title',
        title: '환영 메시지 제목',
        content: '동서로교회에 오신 것을 환영합니다',
        order: 1,
        isActive: true
      },
      {
        key: 'welcome_message',
        title: '환영 메시지 내용',
        content: '우리는 하나님의 말씀을 중심으로 한 신앙 공동체입니다. 모든 사람이 하나님의 사랑을 경험하고 성장할 수 있는 곳입니다. 함께 예배하고, 교제하며, 섬기는 기쁨을 나누어요.',
        order: 2,
        isActive: true
      },
      {
        key: 'ministry_intro',
        title: '사역 소개',
        content: '우리 교회는 다양한 사역을 통해 성도들의 신앙 성장을 돕고 있습니다.',
        order: 3,
        isActive: true
      },
      {
        key: 'event_banner',
        title: '행사 안내',
        content: '다가오는 특별한 행사를 확인하세요!',
        order: 4,
        isActive: true
      },
      {
        key: 'church_vision',
        title: '교회 비전',
        content: '말씀과 기도로 세워지는 교회, 사랑과 섬김으로 하나되는 공동체',
        order: 5,
        isActive: true
      }
    ];

    let createdCount = 0;

    for (const contentData of initialContents) {
      const existing = await prisma.siteContent.findUnique({
        where: { key: contentData.key }
      });

      if (existing) {
        console.log(`⚠️  ${contentData.key}는 이미 존재합니다. 건너뜀...`);
        continue;
      }

      await prisma.siteContent.create({
        data: contentData
      });

      createdCount++;
      console.log(`✅ ${contentData.title} (${contentData.key})`);
    }

    console.log(`\n🎉 총 ${createdCount}개의 콘텐츠가 생성되었습니다!`);

    // 생성된 모든 콘텐츠 조회
    const allContents = await prisma.siteContent.findMany({
      orderBy: { order: 'asc' }
    });

    console.log('\n📋 현재 사이트 콘텐츠:');
    console.log('==========================================');
    allContents.forEach(content => {
      console.log(`${content.order}. [${content.key}] ${content.title}`);
      console.log(`   내용: ${content.content.substring(0, 50)}...`);
      console.log(`   상태: ${content.isActive ? '활성화' : '비활성화'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ 콘텐츠 생성 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialContent();
