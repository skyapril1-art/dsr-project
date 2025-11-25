import { PrismaClient } from '../app/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // 기존 관리자 계정이 있는지 확인
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      console.log('관리자 계정이 이미 존재합니다:', existingAdmin.email);
      return;
    }

    // 관리자 계정 생성
    const hashedPassword = await bcrypt.hash('admin123!', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        name: '관리자',
        email: 'admin@dongseoro.or.kr',
        password: hashedPassword,
        role: 'admin',
      },
    });

    console.log('✅ 관리자 계정이 생성되었습니다!');
    console.log('이메일: admin@dongseoro.or.kr');
    console.log('비밀번호: admin123!');
    console.log('생성된 관리자 ID:', adminUser.id);

  } catch (error) {
    console.error('❌ 관리자 계정 생성 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 스크립트 실행
createAdminUser();