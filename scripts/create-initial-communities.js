const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // 기존 커뮤니티 데이터가 있는지 확인
    const existingCommunities = await prisma.community.findMany();
    
    if (existingCommunities.length > 0) {
      console.log(`이미 ${existingCommunities.length}개의 커뮤니티가 존재합니다.`);
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('기존 데이터를 삭제하고 새로 생성하시겠습니까? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          await prisma.community.deleteMany();
          console.log('기존 커뮤니티 데이터를 삭제했습니다.');
          await createCommunities();
        } else {
          console.log('작업을 취소했습니다.');
        }
        rl.close();
        await prisma.$disconnect();
      });
    } else {
      await createCommunities();
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('오류 발생:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function createCommunities() {
  const communities = [
    {
      name: "믿음 목장",
      leader: "김목자 성도",
      area: "익산시 중앙동 일대",
      members: 12,
      meetingDay: "화요일 오후 7시",
      description: "말씀과 기도로 함께 성장하는 목장입니다.",
      order: 1,
      isActive: true
    },
    {
      name: "소망 목장",
      leader: "이목자 성도", 
      area: "익산시 영등동 일대",
      members: 15,
      meetingDay: "수요일 오후 7시",
      description: "서로 사랑하며 돌보는 따뜻한 목장입니다.",
      order: 2,
      isActive: true
    },
    {
      name: "사랑 목장",
      leader: "박목자 성도",
      area: "익산시 모현동 일대", 
      members: 10,
      meetingDay: "목요일 오후 7시",
      description: "청년들이 주축이 되는 활기찬 목장입니다.",
      order: 3,
      isActive: true
    },
    {
      name: "은혜 목장",
      leader: "최목자 성도",
      area: "익산시 부송동 일대",
      members: 18,
      meetingDay: "금요일 오후 7시", 
      description: "가족 단위로 참여하는 화목한 목장입니다.",
      order: 4,
      isActive: true
    },
    {
      name: "평강 목장",
      leader: "정목자 성도",
      area: "익산시 신용동 일대",
      members: 14,
      meetingDay: "토요일 오후 3시",
      description: "말씀 나눔과 교제가 활발한 목장입니다.",
      order: 5,
      isActive: true
    },
    {
      name: "기쁨 목장",
      leader: "한목자 성도",
      area: "익산시 어양동 일대", 
      members: 11,
      meetingDay: "주일 오후 3시",
      description: "찬양과 기도가 넘치는 목장입니다.",
      order: 6,
      isActive: true
    }
  ];

  console.log('커뮤니티 데이터를 생성하는 중...');

  for (const communityData of communities) {
    const community = await prisma.community.create({
      data: communityData
    });
    console.log(`✓ ${community.name} 생성 완료 (ID: ${community.id})`);
  }

  console.log('\n커뮤니티 초기 데이터 생성이 완료되었습니다!');
  console.log(`총 ${communities.length}개의 커뮤니티가 생성되었습니다.`);
}

main();
