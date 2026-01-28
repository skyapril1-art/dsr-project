require('dotenv/config');
const { PrismaClient } = require('../app/generated/prisma/index.js');

async function seedMissingData() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== 누락된 데이터 생성 시작 ===\n');
    
    // 목회자 데이터 생성
    console.log('목회자 데이터 생성 중...');
    await prisma.pastor.createMany({
      data: [
        {
          name: '김목사',
          position: '담임목사',
          description: '하나님의 말씀을 전하는 신실한 종으로서 교회를 섬기고 있습니다.',
          imageUrl: '/images/pastors/pastor1.jpg',
          order: 1
        },
        {
          name: '이전도사',
          position: '전도사',
          description: '청년부를 담당하며 젊은이들과 함께 하나님을 찾아가고 있습니다.',
          imageUrl: '/images/pastors/pastor2.jpg',
          order: 2
        }
      ]
    });
    console.log('✅ 목회자 2명 생성 완료');
    
    // 사역팀 데이터 생성
    console.log('사역팀 데이터 생성 중...');
    await prisma.ministryTeam.createMany({
      data: [
        {
          name: '찬양팀',
          description: '예배의 찬양을 이끌며 하나님을 높입니다.',
          activities: JSON.stringify(['주일 예배 찬양', '수요 예배 찬양', '특별 집회 찬양']),
          icon: 'fa-music',
          order: 1
        },
        {
          name: '교육팀',
          description: '말씀 교육과 양육을 담당합니다.',
          activities: JSON.stringify(['주일학교 운영', '성경 공부', '제자 양육']),
          icon: 'fa-book',
          order: 2
        },
        {
          name: '선교팀',
          description: '복음을 땅 끝까지 전합니다.',
          activities: JSON.stringify(['국내 선교', '해외 선교', '선교 기도회']),
          icon: 'fa-globe',
          order: 3
        },
        {
          name: '봉사팀',
          description: '사랑으로 교회와 이웃을 섬깁니다.',
          activities: JSON.stringify(['주차 안내', '청소 봉사', '식사 준비']),
          icon: 'fa-hands-helping',
          order: 4
        }
      ]
    });
    console.log('✅ 사역팀 4개 생성 완료');
    
    // 사역 정보 생성
    console.log('사역 정보 생성 중...');
    await prisma.ministryInfo.createMany({
      data: [
        {
          key: 'participation_guide',
          title: '참여 안내',
          content: JSON.stringify({
            steps: [
              '관심 있는 사역팀 찾기',
              '담당자에게 문의하기',
              '오리엔테이션 참석',
              '사역 시작'
            ]
          })
        },
        {
          key: 'contact_info',
          title: '문의하기',
          content: JSON.stringify({
            phone: '031-123-4567',
            email: 'ministry@dongseoro.com',
            kakao: '동서로교회'
          })
        }
      ]
    });
    console.log('✅ 사역 정보 2개 생성 완료');
    
    console.log('\n=== 모든 데이터 생성 완료 ===');
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMissingData();
