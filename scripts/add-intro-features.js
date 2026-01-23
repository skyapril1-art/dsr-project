const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('가정교회360 메인 특징 생성 중...');

  const introFeatures = [
    {
      key: 'intro_feature_1',
      title: '가정 중심의 신앙 교육',
      content: JSON.stringify(['가정은 하나님께서 세우신 최초의 교육 기관입니다. 가정교회360은 부모가 자녀에게 신앙을 전수하고, 온 가족이 함께 예배하며 성장하는 아름다운 신앙 공동체를 만들어갑니다.']),
      icon: 'home',
      order: 1,
      isActive: true
    },
    {
      key: 'intro_feature_2',
      title: '세대 통합 프로그램',
      content: JSON.stringify(['영유아부터 성인까지 모든 세대가 함께 배우고 성장합니다. 각 연령에 맞는 맞춤형 커리큘럼과 함께 가족 단위의 통합 활동으로 세대 간 소통과 이해를 증진시킵니다.']),
      icon: 'users',
      order: 2,
      isActive: true
    },
    {
      key: 'intro_feature_3',
      title: '실천 중심 신앙생활',
      content: JSON.stringify(['말씀을 듣는 것에서 그치지 않고 일상에서 실천하는 살아있는 신앙을 추구합니다. 가정 예배, 기도, 나눔을 통해 하나님의 사랑을 경험하고 이웃과 함께 나눕니다.']),
      icon: 'hands-praying',
      order: 3,
      isActive: true
    },
    {
      key: 'intro_feature_4',
      title: '공동체와 함께하는 성장',
      content: JSON.stringify(['혼자가 아닌 교회 공동체와 함께 성장합니다. 소그룹 모임, 멘토링, 가족 캠프 등을 통해 서로 격려하고 기도하며 믿음의 여정을 함께 걸어갑니다.']),
      icon: 'people-group',
      order: 4,
      isActive: true
    }
  ];

  for (const item of introFeatures) {
    await prisma.family360Content.upsert({
      where: { key: item.key },
      update: item,
      create: item
    });
    console.log(`✅ ${item.title} 추가됨`);
  }

  console.log('\n🎉 가정교회360 메인 특징 생성 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 오류:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
