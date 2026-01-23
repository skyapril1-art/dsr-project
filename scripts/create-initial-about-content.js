const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('교회소개 초기 데이터 생성 중...');

  // 비전과 미션
  await prisma.aboutContent.upsert({
    where: { key: 'vision' },
    update: {},
    create: {
      key: 'vision',
      title: '우리의 비전',
      content: '예수 그리스도의 사랑을 전하며, 모든 성도가 하나님의 말씀 안에서 성장하고 세상을 변화시키는 건강한 교회가 되는 것입니다.',
      order: 1,
      isActive: true
    }
  });

  await prisma.aboutContent.upsert({
    where: { key: 'mission' },
    update: {},
    create: {
      key: 'mission',
      title: '우리의 사명',
      content: '예배를 통해 하나님께 영광을 돌리고, 말씀을 통해 제자를 양육하며, 사랑을 통해 지역사회를 섬기는 것입니다.',
      order: 2,
      isActive: true
    }
  });

  // 교회 연혁
  const historyItems = [
    { year: '1990년', description: '동서로교회 개척' },
    { year: '2000년', description: '새 성전 건축 및 이전' },
    { year: '2010년', description: '선교관 증축' },
    { year: '2020년', description: '온라인 예배 시스템 구축' }
  ];

  for (let i = 0; i < historyItems.length; i++) {
    await prisma.aboutContent.upsert({
      where: { key: `history_${i + 1}` },
      update: {},
      create: {
        key: `history_${i + 1}`,
        title: historyItems[i].year,
        content: JSON.stringify({ description: historyItems[i].description }),
        order: 10 + i,
        isActive: true
      }
    });
  }

  // 목회진
  const pastors = [
    { 
      title: '담임목사',
      description: '말씀과 기도로 교회를 섬기고 있습니다.',
      imageUrl: '/images/ministry/담임목사.png'
    },
    { 
      title: '부목사',
      description: '청년부와 교육 사역을 담당하고 있습니다.',
      imageUrl: '/images/ministry/부목사.png'
    },
    { 
      title: '전도사',
      description: '어린이와 청소년 사역을 섬기고 있습니다.',
      imageUrl: '/images/ministry/전도사.png'
    }
  ];

  for (let i = 0; i < pastors.length; i++) {
    await prisma.aboutContent.upsert({
      where: { key: `pastor_${i + 1}` },
      update: {},
      create: {
        key: `pastor_${i + 1}`,
        title: pastors[i].title,
        content: JSON.stringify({ description: pastors[i].description }),
        imageUrl: pastors[i].imageUrl,
        order: 20 + i,
        isActive: true
      }
    });
  }

  // 예배 시간
  await prisma.aboutContent.upsert({
    where: { key: 'worship_sunday' },
    update: {},
    create: {
      key: 'worship_sunday',
      title: '주일 예배',
      content: JSON.stringify({
        times: [
          '1부 예배: 오전 8:00',
          '2부 예배: 오전 10:30',
          '3부 예배: 오후 2:00',
          '주일학교: 오전 10:30'
        ]
      }),
      order: 30,
      isActive: true
    }
  });

  await prisma.aboutContent.upsert({
    where: { key: 'worship_weekday' },
    update: {},
    create: {
      key: 'worship_weekday',
      title: '주중 예배',
      content: JSON.stringify({
        times: [
          '수요예배: 수요일 오후 7:30',
          '새벽예배: 매일 오전 6:00',
          '금요기도회: 금요일 오후 7:30'
        ]
      }),
      order: 31,
      isActive: true
    }
  });

  console.log('교회소개 초기 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
