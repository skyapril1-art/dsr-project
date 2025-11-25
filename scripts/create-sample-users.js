import { PrismaClient } from '../app/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createSampleUsers() {
  try {
    const sampleUsers = [
      {
        name: '김성도',
        email: 'kim@dongseoro.or.kr',
        password: 'user123!'
      },
      {
        name: '이은혜',
        email: 'lee@dongseoro.or.kr',
        password: 'user123!'
      },
      {
        name: '박믿음',
        email: 'park@dongseoro.or.kr',
        password: 'user123!'
      },
      {
        name: '최소망',
        email: 'choi@dongseoro.or.kr',
        password: 'user123!'
      },
      {
        name: '정평강',
        email: 'jung@dongseoro.or.kr',
        password: 'user123!'
      }
    ];

    console.log('📝 5개의 샘플 사용자 계정을 생성합니다...\n');

    const createdUsers = [];

    for (const userData of sampleUsers) {
      // 이미 존재하는 이메일인지 확인
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        console.log(`⚠️  ${userData.email}은 이미 존재하는 계정입니다. 건너뛰는 중...`);
        continue;
      }

      // 비밀번호 해시화
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // 사용자 생성
      const newUser = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: 'user',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        }
      });

      createdUsers.push(newUser);
      console.log(`✅ ${newUser.name} (${newUser.email}) - ID: ${newUser.id}`);
    }

    console.log(`\n🎉 총 ${createdUsers.length}개의 사용자 계정이 생성되었습니다!`);
    
    if (createdUsers.length > 0) {
      console.log('\n📋 생성된 계정 정보:');
      console.log('==========================================');
      createdUsers.forEach(user => {
        console.log(`ID: ${user.id} | 이름: ${user.name} | 이메일: ${user.email}`);
      });
      console.log('==========================================');
      console.log('🔑 모든 계정의 비밀번호: user123!');
    }

    // 전체 사용자 통계
    const totalUsers = await prisma.user.count();
    const adminUsers = await prisma.user.count({ where: { role: 'admin' } });
    const regularUsers = await prisma.user.count({ where: { role: 'user' } });

    console.log('\n📊 현재 사용자 통계:');
    console.log(`- 전체 사용자: ${totalUsers}명`);
    console.log(`- 관리자: ${adminUsers}명`);
    console.log(`- 일반 사용자: ${regularUsers}명`);

  } catch (error) {
    console.error('❌ 사용자 생성 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
createSampleUsers();