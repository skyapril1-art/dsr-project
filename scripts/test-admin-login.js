import { PrismaClient } from '../app/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function testAdminLogin() {
  try {
    console.log('🔐 관리자 로그인 테스트...');
    
    // 관리자 계정 확인
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@dongseoro.or.kr' }
    });

    if (!admin) {
      console.log('❌ 관리자 계정이 없습니다.');
      return;
    }

    console.log(`✅ 관리자 계정 발견: ${admin.name} (${admin.email})`);
    console.log(`   역할: ${admin.role}`);
    
    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare('admin123!', admin.password);
    console.log(`   비밀번호 검증: ${isPasswordValid ? '✅ 성공' : '❌ 실패'}`);

  } catch (error) {
    console.error('테스트 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminLogin();