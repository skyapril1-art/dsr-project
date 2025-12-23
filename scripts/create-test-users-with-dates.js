import { PrismaClient } from '../app/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUsers() {
  try {
    console.log('📝 최근 7일간 테스트 사용자를 생성합니다...\n');

    const testUsers = [
      // 오늘 (3명)
      { name: '오늘가입1', email: 'today1@test.com', daysAgo: 0 },
      { name: '오늘가입2', email: 'today2@test.com', daysAgo: 0 },
      { name: '오늘가입3', email: 'today3@test.com', daysAgo: 0 },
      
      // 1일 전 (5명)
      { name: '어제가입1', email: 'yesterday1@test.com', daysAgo: 1 },
      { name: '어제가입2', email: 'yesterday2@test.com', daysAgo: 1 },
      { name: '어제가입3', email: 'yesterday3@test.com', daysAgo: 1 },
      { name: '어제가입4', email: 'yesterday4@test.com', daysAgo: 1 },
      { name: '어제가입5', email: 'yesterday5@test.com', daysAgo: 1 },
      
      // 2일 전 (2명)
      { name: '2일전가입1', email: '2days1@test.com', daysAgo: 2 },
      { name: '2일전가입2', email: '2days2@test.com', daysAgo: 2 },
      
      // 3일 전 (4명)
      { name: '3일전가입1', email: '3days1@test.com', daysAgo: 3 },
      { name: '3일전가입2', email: '3days2@test.com', daysAgo: 3 },
      { name: '3일전가입3', email: '3days3@test.com', daysAgo: 3 },
      { name: '3일전가입4', email: '3days4@test.com', daysAgo: 3 },
      
      // 4일 전 (1명)
      { name: '4일전가입1', email: '4days1@test.com', daysAgo: 4 },
      
      // 5일 전 (6명)
      { name: '5일전가입1', email: '5days1@test.com', daysAgo: 5 },
      { name: '5일전가입2', email: '5days2@test.com', daysAgo: 5 },
      { name: '5일전가입3', email: '5days3@test.com', daysAgo: 5 },
      { name: '5일전가입4', email: '5days4@test.com', daysAgo: 5 },
      { name: '5일전가입5', email: '5days5@test.com', daysAgo: 5 },
      { name: '5일전가입6', email: '5days6@test.com', daysAgo: 5 },
      
      // 6일 전 (3명)
      { name: '6일전가입1', email: '6days1@test.com', daysAgo: 6 },
      { name: '6일전가입2', email: '6days2@test.com', daysAgo: 6 },
      { name: '6일전가입3', email: '6days3@test.com', daysAgo: 6 },
    ];

    const hashedPassword = await bcrypt.hash('test123!', 10);
    let createdCount = 0;

    for (const userData of testUsers) {
      // 이미 존재하는 이메일인지 확인
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  ${userData.email}은 이미 존재합니다. 건너뜀...`);
        continue;
      }

      // 날짜 계산
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - userData.daysAgo);
      
      // 사용자 생성
      await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: 'user',
          createdAt: createdAt
        },
      });

      createdCount++;
      console.log(`✅ ${userData.name} (${userData.daysAgo}일 전) - ${userData.email}`);
    }

    console.log(`\n✅ 총 ${createdCount}명의 테스트 사용자가 생성되었습니다!`);
    console.log('비밀번호: test123!');

  } catch (error) {
    console.error('❌ 테스트 사용자 생성 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUsers();
