import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function updateAdminIdDirect() {
  try {
    // 현재 관리자 계정 확인
    const adminUser = await prisma.user.findFirst({
      where: { 
        email: 'admin@dongseoro.or.kr',
        role: 'admin'
      }
    });

    if (!adminUser) {
      console.log('❌ 관리자 계정을 찾을 수 없습니다.');
      return;
    }

    console.log('현재 관리자 계정 정보:');
    console.log(`현재 ID: ${adminUser.id}`);
    console.log(`이름: ${adminUser.name}`);
    console.log(`이메일: ${adminUser.email}`);

    if (adminUser.id === 1) {
      console.log('✅ 관리자 계정의 ID가 이미 1입니다.');
      return;
    }

    // Raw SQL을 사용하여 직접 업데이트
    console.log('ID 업데이트를 시도합니다...');
    
    // AUTO_INCREMENT 비활성화 및 ID 업데이트
    await prisma.$executeRaw`SET foreign_key_checks = 0`;
    await prisma.$executeRaw`UPDATE User SET id = 1 WHERE id = ${adminUser.id}`;
    await prisma.$executeRaw`ALTER TABLE User AUTO_INCREMENT = 2`;
    await prisma.$executeRaw`SET foreign_key_checks = 1`;

    // 업데이트된 정보 확인
    const updatedAdmin = await prisma.user.findUnique({
      where: { id: 1 }
    });

    if (updatedAdmin) {
      console.log('✅ 관리자 계정 ID가 성공적으로 업데이트되었습니다!');
      console.log(`새 ID: ${updatedAdmin.id}`);
      console.log(`이름: ${updatedAdmin.name}`);
      console.log(`이메일: ${updatedAdmin.email}`);
      console.log(`역할: ${updatedAdmin.role}`);
    } else {
      console.log('❌ 업데이트 확인에 실패했습니다.');
    }

  } catch (error) {
    console.error('❌ ID 업데이트 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
updateAdminIdDirect();