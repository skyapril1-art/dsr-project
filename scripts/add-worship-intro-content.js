import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function addWorshipAndIntro() {
  try {
    console.log('📝 예배안내와 교회소개 콘텐츠를 추가합니다...\n');

    const newContents = [
      // 예배 안내
      {
        key: 'worship_sunday',
        title: '주일 예배',
        content: '1부: 오전 8:00\n2부: 오전 10:30\n3부: 오후 2:00\n장소: 본당',
        order: 10,
        isActive: true
      },
      {
        key: 'worship_wednesday',
        title: '수요 예배',
        content: '시간: 오후 7:30\n장소: 본당\n내용: 말씀과 기도',
        order: 11,
        isActive: true
      },
      
      // 교회 소개 - 사랑
      {
        key: 'intro_love',
        title: '사랑',
        content: '하나님의 사랑을 경험하고 나누는 공동체',
        imageUrl: 'fa-heart', // 아이콘 이름 저장
        order: 20,
        isActive: true
      },
      
      // 교회 소개 - 말씀
      {
        key: 'intro_word',
        title: '말씀',
        content: '성경 말씀을 중심으로 한 신앙 생활',
        imageUrl: 'fa-book', // 아이콘 이름 저장
        order: 21,
        isActive: true
      },
      
      // 교회 소개 - 섬김
      {
        key: 'intro_service',
        title: '섬김',
        content: '서로 섬기고 지역사회를 사랑하는 교회',
        imageUrl: 'fa-hands', // 아이콘 이름 저장
        order: 22,
        isActive: true
      }
    ];

    let createdCount = 0;

    for (const contentData of newContents) {
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

    console.log(`\n🎉 총 ${createdCount}개의 콘텐츠가 추가되었습니다!`);

    // 전체 콘텐츠 확인
    const allContents = await prisma.siteContent.findMany({
      orderBy: { order: 'asc' }
    });

    console.log('\n📋 현재 모든 콘텐츠:');
    console.log('==========================================');
    allContents.forEach(content => {
      console.log(`${content.order}. [${content.key}] ${content.title}`);
    });
    console.log('==========================================');

  } catch (error) {
    console.error('❌ 콘텐츠 추가 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addWorshipAndIntro();
