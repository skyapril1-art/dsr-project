const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('가정교회360 초기 데이터 생성 중...');

  // 가정교회360 안내
  const intro = {
    key: 'intro_1',
    title: '가정교회 360 안내',
    content: JSON.stringify({
      title: '가정교회 360 안내',
      subtitle: '여러분의 가정이 하나님의 사랑으로 가득한 작은 교회가 되도록 함께하세요.',
      contact: '문의: 교회 사무실 | 이메일: family360@dongseoro.or.kr'
    }),
    icon: 'info-circle',
    order: 100
  };

  await prisma.family360Content.upsert({
    where: { key: intro.key },
    update: {},
    create: intro
  });

  // 소개 특징
  const introFeatures = [
    {
      key: 'intro_feature_1',
      title: '가정 중심',
      content: JSON.stringify(['가정은 하나님께서 세우신 최초의 교육 기관입니다. 가정교회360은 부모가 자녀에게 신앙을 전수하고, 온 가족이 함께 예배하며 성장하는 아름다운 신앙 공동체를 만들어갑니다.']),
      icon: 'home',
      order: 1
    },
    {
      key: 'intro_feature_2',
      title: '360도 접근',
      content: JSON.stringify({
        icon: 'sync-alt',
        description: '영적, 정서적, 지적, 사회적 모든 영역을 포괄하는 전인교육'
      }),
      icon: 'sync-alt',
      order: 2
    },
    {
      key: 'intro_feature_3',
      title: '지속적 성장',
      content: JSON.stringify({
        icon: 'seedling',
        description: '평생에 걸친 신앙 성장과 제자도의 실현'
      }),
      icon: 'seedling',
      order: 3
    }
  ];

  for (const item of introFeatures) {
    await prisma.family360Content.upsert({
      where: { key: item.key },
      update: {},
      create: item
    });
  }

  // 프로그램
  const programs = [
    {
      key: 'program_1',
      title: '영유아부',
      content: JSON.stringify({
        age: '0-5세',
        description: '기초 신앙 형성',
        color: 'red',
        icon: 'baby'
      }),
      icon: 'baby',
      order: 10
    },
    {
      key: 'program_2',
      title: '어린이부',
      content: JSON.stringify({
        age: '6-12세',
        description: '성경 이야기와 신앙 교육',
        color: 'yellow',
        icon: 'child'
      }),
      icon: 'child',
      order: 11
    },
    {
      key: 'program_3',
      title: '청소년부',
      content: JSON.stringify({
        age: '13-18세',
        description: '정체성 확립과 신앙 성장',
        color: 'green',
        icon: 'user-graduate'
      }),
      icon: 'user-graduate',
      order: 12
    },
    {
      key: 'program_4',
      title: '성인부',
      content: JSON.stringify({
        age: '19세 이상',
        description: '제자도와 사역자 훈련',
        color: 'blue',
        icon: 'users'
      }),
      icon: 'users',
      order: 13
    }
  ];

  for (const item of programs) {
    await prisma.family360Content.upsert({
      where: { key: item.key },
      update: {},
      create: item
    });
  }

  // 핵심 활동
  const activities = [
    {
      key: 'activity_1',
      title: '가정 예배',
      content: JSON.stringify({
        items: [
          '매일 가정에서 드리는 가족 예배',
          '연령별 맞춤 예배 가이드 제공',
          '가족 구성원 모두가 참여하는 프로그램',
          '계절과 절기에 맞는 특별 예배'
        ]
      }),
      order: 20
    },
    {
      key: 'activity_2',
      title: '신앙 교육',
      content: JSON.stringify({
        items: [
          '체계적인 성경 교육 커리큘럼',
          '연령별 신앙 성장 단계 프로그램',
          '부모를 위한 신앙 교육 지침서',
          '정기적인 평가와 피드백'
        ]
      }),
      order: 21
    },
    {
      key: 'activity_3',
      title: '생활 훈련',
      content: JSON.stringify({
        items: [
          '일상 속 신앙 실천 방법',
          '기독교 세계관 교육',
          '인성과 품성 개발 프로그램',
          '봉사와 나눔의 실천'
        ]
      }),
      order: 22
    },
    {
      key: 'activity_4',
      title: '공동체 활동',
      content: JSON.stringify({
        items: [
          '가정교회 간 교제와 협력',
          '연령별 모임과 활동',
          '특별 행사와 캠프',
          '지역사회 봉사 활동'
        ]
      }),
      order: 23
    }
  ];

  for (const item of activities) {
    await prisma.family360Content.upsert({
      where: { key: item.key },
      update: {},
      create: item
    });
  }

  // 참여 단계
  const steps = [
    {
      key: 'step_1',
      title: '신청',
      content: JSON.stringify({
        step: 1,
        description: '가정교회360 참여 신청서 작성'
      }),
      order: 30
    },
    {
      key: 'step_2',
      title: '오리엔테이션',
      content: JSON.stringify({
        step: 2,
        description: '프로그램 소개 및 교육'
      }),
      order: 31
    },
    {
      key: 'step_3',
      title: '시작',
      content: JSON.stringify({
        step: 3,
        description: '가정에서 프로그램 시작'
      }),
      order: 32
    },
    {
      key: 'step_4',
      title: '성장',
      content: JSON.stringify({
        step: 4,
        description: '지속적인 점검과 성장'
      }),
      order: 33
    }
  ];

  for (const item of steps) {
    await prisma.family360Content.upsert({
      where: { key: item.key },
      update: {},
      create: item
    });
  }

  // 통계
  const statistics = [
    {
      key: 'statistic_1',
      title: '프로그램 만족도',
      content: JSON.stringify({ value: '95%' }),
      order: 40
    },
    {
      key: 'statistic_2',
      title: '참여 가정 수',
      content: JSON.stringify({ value: '150+' }),
      order: 41
    },
    {
      key: 'statistic_3',
      title: '평균 참여 기간',
      content: JSON.stringify({ value: '3년' }),
      order: 42
    }
  ];

  for (const item of statistics) {
    await prisma.family360Content.upsert({
      where: { key: item.key },
      update: {},
      create: item
    });
  }

  console.log('가정교회360 초기 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
