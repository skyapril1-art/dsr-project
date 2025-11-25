import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();

async function updateAdminId() {
  try {
    // 현재 관리자 계정 찾기
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

    // ID 1이 이미 사용 중인지 확인
    const existingUser = await prisma.user.findUnique({
      where: { id: 1 }
    });

    if (existingUser) {
      console.log('❌ ID 1은 이미 다른 사용자가 사용 중입니다.');
      console.log(`기존 사용자: ${existingUser.name} (${existingUser.email})`);
      return;
    }

    // MySQL에서는 직접 ID 업데이트가 제한될 수 있으므로
    // 새로운 사용자를 생성하고 기존 사용자를 삭제하는 방식 사용
    const newAdmin = await prisma.user.create({
      data: {
        id: 1,
        name: adminUser.name,
        email: adminUser.email,
        password: adminUser.password,
        role: adminUser.role,
      }
    });

    // 기존 관리자 계정 삭제
    await prisma.user.delete({
      where: { id: adminUser.id }
    });

    console.log('✅ 관리자 계정 ID가 성공적으로 업데이트되었습니다!');
    console.log(`새 ID: ${newAdmin.id}`);
    console.log(`이름: ${newAdmin.name}`);
    console.log(`이메일: ${newAdmin.email}`);

  } catch (error) {
    console.error('❌ ID 업데이트 중 오류:', error);
    
    // AUTO_INCREMENT 때문에 ID 1로 생성이 안될 수 있습니다
    if (error.code === 'P2002' || error.message.includes('Duplicate entry')) {
      console.log('💡 AUTO_INCREMENT 설정 때문일 수 있습니다.');
      console.log('데이터베이스에서 AUTO_INCREMENT를 리셋해야 할 수 있습니다.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
updateAdminId();