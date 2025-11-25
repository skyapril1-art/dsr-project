import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('📋 데이터베이스 사용자 목록 확인...');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: {
        id: 'asc'
      }
    });

    console.log(`\n총 사용자 수: ${users.length}명\n`);
    
    users.forEach(user => {
      console.log(`ID: ${user.id} | 이름: ${user.name} | 이메일: ${user.email} | 역할: ${user.role} | 가입일: ${user.createdAt.toLocaleDateString('ko-KR')}`);
    });

    console.log('\n📊 역할별 통계:');
    const adminCount = users.filter(u => u.role === 'admin').length;
    const userCount = users.filter(u => u.role === 'user').length;
    console.log(`관리자: ${adminCount}명`);
    console.log(`일반사용자: ${userCount}명`);

  } catch (error) {
    console.error('사용자 조회 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();