import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function createInitialSlides() {
  try {
    console.log('📝 초기 메인 슬라이드를 생성합니다...\n');

    const initialSlides = [
      {
        imageUrl: '/images/gallery/메인사진.jpg',
        title: '동서로교회',
        description: '하나님의 말씀을 중심으로',
        order: 1,
        isActive: true
      },
      {
        imageUrl: '/images/gallery/005b55574b89de19fcec80c7e32d8c15.jpg',
        title: '',
        description: '',
        order: 2,
        isActive: true
      },
      {
        imageUrl: '/images/gallery/75def23abc7bbd4a9d64adf360eeb145.jpg',
        title: '',
        description: '',
        order: 3,
        isActive: true
      },
      {
        imageUrl: '/images/gallery/ed9ad5fee6294997f6fb4dc3122feec7.jpg',
        title: '',
        description: '',
        order: 4,
        isActive: true
      }
    ];

    let createdCount = 0;

    for (const slideData of initialSlides) {
      const existing = await prisma.mainSlide.findFirst({
        where: { imageUrl: slideData.imageUrl }
      });

      if (existing) {
        console.log(`⚠️  ${slideData.imageUrl}는 이미 존재합니다. 건너뜀...`);
        continue;
      }

      await prisma.mainSlide.create({
        data: slideData
      });

      createdCount++;
      console.log(`✅ 슬라이드 ${slideData.order} 추가: ${slideData.imageUrl}`);
    }

    console.log(`\n🎉 총 ${createdCount}개의 슬라이드가 생성되었습니다!`);

    // 생성된 모든 슬라이드 조회
    const allSlides = await prisma.mainSlide.findMany({
      orderBy: { order: 'asc' }
    });

    console.log('\n📋 현재 메인 슬라이드:');
    console.log('==========================================');
    allSlides.forEach(slide => {
      console.log(`${slide.order}. ${slide.imageUrl}`);
      console.log(`   제목: ${slide.title || '(없음)'}`);
      console.log(`   상태: ${slide.isActive ? '✅ 활성화' : '❌ 비활성화'}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ 슬라이드 생성 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createInitialSlides();
