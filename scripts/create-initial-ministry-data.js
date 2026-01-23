const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('사역팀 초기 데이터 생성 시작...');

  // 1. 목회자 데이터
  const pastors = [
    {
      name: '담임목사',
      position: '담임목사',
      description: '교회를 이끌고 말씀을 전합니다',
      imageUrl: '/images/ministry/담임목사.png',
      order: 1,
      isActive: true,
    },
    {
      name: '부목사',
      position: '부목사',
      description: '교육과 양육을 담당합니다',
      imageUrl: '/images/ministry/부목사.png',
      order: 2,
      isActive: true,
    },
    {
      name: '전도사',
      position: '전도사',
      description: '전도와 심방을 담당합니다',
      imageUrl: '/images/ministry/전도사.png',
      order: 3,
      isActive: true,
    },
  ];

  for (const pastor of pastors) {
    await prisma.pastor.upsert({
      where: { id: pastors.indexOf(pastor) + 1 },
      update: pastor,
      create: pastor,
    });
    console.log(`✓ ${pastor.position} 생성/업데이트 완료`);
  }

  // 2. 사역팀 데이터
  const teams = [
    {
      name: '예배팀',
      description: '하나님께 영광을 돌리는 예배를 인도합니다.',
      activities: JSON.stringify(['찬양', '연주', '음향', '영상']),
      icon: 'fa-music',
      order: 1,
      isActive: true,
    },
    {
      name: '교육팀',
      description: '말씀으로 다음 세대를 양육합니다.',
      activities: JSON.stringify(['주일학교', '청년부', '성경공부', '제자훈련']),
      icon: 'fa-book',
      order: 2,
      isActive: true,
    },
    {
      name: '전도팀',
      description: '복음을 전하고 영혼을 구원합니다.',
      activities: JSON.stringify(['노방전도', '심방', '전도대회', '선교']),
      icon: 'fa-heart',
      order: 3,
      isActive: true,
    },
    {
      name: '봉사팀',
      description: '사랑으로 교회와 지역사회를 섬깁니다.',
      activities: JSON.stringify(['청소', '주차안내', '식당봉사', '구제']),
      icon: 'fa-hands',
      order: 4,
      isActive: true,
    },
    {
      name: '기술팀',
      description: '기술로 하나님의 일에 동참합니다.',
      activities: JSON.stringify(['방송', '홈페이지', '음향시설', '영상편집']),
      icon: 'fa-computer',
      order: 5,
      isActive: true,
    },
    {
      name: '행정팀',
      description: '교회 운영을 체계적으로 관리합니다.',
      activities: JSON.stringify(['재정관리', '문서관리', '행사기획', '시설관리']),
      icon: 'fa-building',
      order: 6,
      isActive: true,
    },
  ];

  for (const team of teams) {
    await prisma.ministryTeam.upsert({
      where: { id: teams.indexOf(team) + 1 },
      update: team,
      create: team,
    });
    console.log(`✓ ${team.name} 생성/업데이트 완료`);
  }

  // 3. 사역 참여 안내
  const participationGuide = {
    procedure: [
      '관심 있는 사역팀 선택',
      '해당 팀장과 상담',
      '사역 오리엔테이션 참석',
      '사역 시작',
    ],
    attitude: [
      '겸손한 마음으로 섬기기',
      '팀원들과 협력하기',
      '지속적인 성장 추구',
      '하나님께 영광 돌리기',
    ],
  };

  await prisma.ministryInfo.upsert({
    where: { key: 'participation_guide' },
    update: {
      title: '사역 참여 안내',
      content: JSON.stringify(participationGuide),
    },
    create: {
      key: 'participation_guide',
      title: '사역 참여 안내',
      content: JSON.stringify(participationGuide),
    },
  });
  console.log('✓ 사역 참여 안내 생성/업데이트 완료');

  // 4. 사역 문의
  const contactInfo = {
    description: '각 사역팀에 대한 자세한 문의는 교회 사무실로 연락해주세요.',
    phone: '교회 사무실',
  };

  await prisma.ministryInfo.upsert({
    where: { key: 'contact_info' },
    update: {
      title: '사역 문의',
      content: JSON.stringify(contactInfo),
    },
    create: {
      key: 'contact_info',
      title: '사역 문의',
      content: JSON.stringify(contactInfo),
    },
  });
  console.log('✓ 사역 문의 정보 생성/업데이트 완료');

  console.log('\n✅ 사역팀 초기 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error('❌ 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
