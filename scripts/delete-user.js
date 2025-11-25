import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function deleteUser() {
  try {
    const userId = 1;
    
    // 먼저 해당 사용자가 존재하는지 확인
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    if (!user) {
      console.log(`❌ ID ${userId}번 사용자를 찾을 수 없습니다.`);
      return;
    }

    console.log('삭제할 사용자 정보:');
    console.log(`ID: ${user.id}`);
    console.log(`이름: ${user.name}`);
    console.log(`이메일: ${user.email}`);
    console.log(`역할: ${user.role}`);

    // 관리자인 경우 마지막 관리자인지 확인
    if (user.role === 'admin') {
      const adminCount = await prisma.user.count({
        where: { role: 'admin' }
      });

      if (adminCount <= 1) {
        console.log('❌ 마지막 관리자는 삭제할 수 없습니다.');
        return;
      }
    }

    // 사용자 삭제
    const deletedUser = await prisma.user.delete({
      where: { id: userId }
    });

    console.log(`✅ ID ${userId}번 사용자가 성공적으로 삭제되었습니다.`);

  } catch (error) {
    console.error('❌ 사용자 삭제 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
deleteUser();