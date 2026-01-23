const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('교회소개 데이터 업데이트 중...');

  // 1. 비전/사명 통합 데이터
  await prisma.aboutContent.upsert({
    where: { key: 'vision' },
    update: {
      title: 'Vision & Mission',
      content: JSON.stringify({
        vision: '예수 그리스도의 사랑을 전하며, 모든 성도가 하나님의 말씀 안에서 성장하고 세상을 변화시키는 건강한 교회가 되는 것입니다.',
        mission: '예배를 통해 하나님께 영광을 돌리고, 말씀을 통해 제자를 양육하며, 사랑을 통해 지역사회를 섬기는 것입니다.'
      }),
      order: 1,
      isActive: true
    },
    create: {
      key: 'vision',
      title: 'Vision & Mission',
      content: JSON.stringify({
        vision: '예수 그리스도의 사랑을 전하며, 모든 성도가 하나님의 말씀 안에서 성장하고 세상을 변화시키는 건강한 교회가 되는 것입니다.',
        mission: '예배를 통해 하나님께 영광을 돌리고, 말씀을 통해 제자를 양육하며, 사랑을 통해 지역사회를 섬기는 것입니다.'
      }),
      order: 1,
      isActive: true
    }
  });

  // 2. 교회 연혁 (배열 형태)
  await prisma.aboutContent.upsert({
    where: { key: 'history' },
    update: {
      title: 'Church History',
      content: JSON.stringify([
        { year: '1990년', event: '동서로교회 개척 예배 시작' },
        { year: '1995년', event: '첫 성전 헌당 및 등록 교인 100명 돌파' },
        { year: '2000년', event: '새 성전 건축 및 이전 (현재 위치)' },
        { year: '2005년', event: '선교부 설립 및 해외 선교 시작' },
        { year: '2010년', event: '선교관 증축 및 교육관 완공' },
        { year: '2015년', event: '청년부 독립 및 가정교회360 시작' },
        { year: '2020년', event: '온라인 예배 시스템 구축 및 디지털 선교 확장' },
        { year: '2025년', event: '창립 35주년 감사예배 및 비전 2030 선포' }
      ]),
      order: 2,
      isActive: true
    },
    create: {
      key: 'history',
      title: 'Church History',
      content: JSON.stringify([
        { year: '1990년', event: '동서로교회 개척 예배 시작' },
        { year: '1995년', event: '첫 성전 헌당 및 등록 교인 100명 돌파' },
        { year: '2000년', event: '새 성전 건축 및 이전 (현재 위치)' },
        { year: '2005년', event: '선교부 설립 및 해외 선교 시작' },
        { year: '2010년', event: '선교관 증축 및 교육관 완공' },
        { year: '2015년', event: '청년부 독립 및 가정교회360 시작' },
        { year: '2020년', event: '온라인 예배 시스템 구축 및 디지털 선교 확장' },
        { year: '2025년', event: '창립 35주년 감사예배 및 비전 2030 선포' }
      ]),
      order: 2,
      isActive: true
    }
  });

  // 3. 목회진 소개 (배열 형태)
  await prisma.aboutContent.upsert({
    where: { key: 'pastor' },
    update: {
      title: 'Pastors',
      content: JSON.stringify([
        {
          name: '김성도 목사',
          education: '서울신학대학교 신학과 졸업\n장로회신학대학교 신학대학원 석사',
          experience: '동서로교회 담임목사 (2000년~현재)\n청년부 전도사 (1995-2000년)',
          message: '하나님의 말씀으로 세워지는 교회, 예수 그리스도의 사랑으로 하나되는 공동체를 꿈꿉니다. 모든 성도가 말씀 안에서 성장하고, 서로 사랑하며, 세상을 변화시키는 그리스도의 제자가 되기를 소망합니다.',
          imageUrl: '/images/ministry/담임목사.png'
        },
        {
          name: '이은혜 부목사',
          education: '감리교신학대학교 신학과 졸업\n총신대학교 신학대학원 석사',
          experience: '동서로교회 부목사 (2015년~현재)\n청년사역 담당',
          message: '청년들과 함께 꿈꾸고 성장하는 교회를 만들어가고 있습니다.',
          imageUrl: '/images/ministry/부목사.png'
        },
        {
          name: '박믿음 전도사',
          education: '장로회신학대학교 신학과 졸업',
          experience: '동서로교회 전도사 (2020년~현재)\n어린이부 및 청소년부 담당',
          message: '어린이와 청소년들이 하나님의 사랑 안에서 자라나도록 섬기고 있습니다.',
          imageUrl: '/images/ministry/전도사.png'
        }
      ]),
      order: 3,
      isActive: true
    },
    create: {
      key: 'pastor',
      title: 'Pastors',
      content: JSON.stringify([
        {
          name: '김성도 목사',
          education: '서울신학대학교 신학과 졸업\n장로회신학대학교 신학대학원 석사',
          experience: '동서로교회 담임목사 (2000년~현재)\n청년부 전도사 (1995-2000년)',
          message: '하나님의 말씀으로 세워지는 교회, 예수 그리스도의 사랑으로 하나되는 공동체를 꿈꿉니다. 모든 성도가 말씀 안에서 성장하고, 서로 사랑하며, 세상을 변화시키는 그리스도의 제자가 되기를 소망합니다.',
          imageUrl: '/images/ministry/담임목사.png'
        },
        {
          name: '이은혜 부목사',
          education: '감리교신학대학교 신학과 졸업\n총신대학교 신학대학원 석사',
          experience: '동서로교회 부목사 (2015년~현재)\n청년사역 담당',
          message: '청년들과 함께 꿈꾸고 성장하는 교회를 만들어가고 있습니다.',
          imageUrl: '/images/ministry/부목사.png'
        },
        {
          name: '박믿음 전도사',
          education: '장로회신학대학교 신학과 졸업',
          experience: '동서로교회 전도사 (2020년~현재)\n어린이부 및 청소년부 담당',
          message: '어린이와 청소년들이 하나님의 사랑 안에서 자라나도록 섬기고 있습니다.',
          imageUrl: '/images/ministry/전도사.png'
        }
      ]),
      order: 3,
      isActive: true
    }
  });

  // 4. 예배 시간 안내 (배열 형태)
  await prisma.aboutContent.upsert({
    where: { key: 'worship' },
    update: {
      title: 'Worship Schedule',
      content: JSON.stringify([
        { day: '주일 1부 예배', time: '오전 8:00', location: '본당' },
        { day: '주일 2부 예배', time: '오전 10:30', location: '본당' },
        { day: '주일 3부 예배', time: '오후 2:00', location: '본당' },
        { day: '주일학교', time: '오전 10:30', location: '교육관' },
        { day: '수요예배', time: '오후 7:30', location: '본당' },
        { day: '새벽예배', time: '오전 6:00', location: '본당' },
        { day: '금요기도회', time: '오후 7:30', location: '기도실' }
      ]),
      order: 4,
      isActive: true
    },
    create: {
      key: 'worship',
      title: 'Worship Schedule',
      content: JSON.stringify([
        { day: '주일 1부 예배', time: '오전 8:00', location: '본당' },
        { day: '주일 2부 예배', time: '오전 10:30', location: '본당' },
        { day: '주일 3부 예배', time: '오후 2:00', location: '본당' },
        { day: '주일학교', time: '오전 10:30', location: '교육관' },
        { day: '수요예배', time: '오후 7:30', location: '본당' },
        { day: '새벽예배', time: '오전 6:00', location: '본당' },
        { day: '금요기도회', time: '오후 7:30', location: '기도실' }
      ]),
      order: 4,
      isActive: true
    }
  });

  console.log('✅ 교회소개 데이터 업데이트 완료!');
  console.log('- vision: 비전/사명 통합');
  console.log('- history: 8개 연혁 항목');
  console.log('- pastor: 3명의 목회진 정보');
  console.log('- worship: 7개 예배 시간');
}

main()
  .catch((e) => {
    console.error('오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
