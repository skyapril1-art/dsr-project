require('dotenv/config');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../app/generated/prisma/index.js');

async function updateAdminPassword() {
  const prisma = new PrismaClient();
  
  try {
    // 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    console.log('해시된 비밀번호:', hashedPassword);
    
    // 관리자 계정 업데이트
    const result = await prisma.user.updateMany({
      where: { email: 'admin@dongseoro.com' },
      data: { password: hashedPassword }
    });
    
    console.log(`✅ ${result.count}개의 관리자 계정이 업데이트되었습니다.`);
    
    // 업데이트된 사용자 확인
    const user = await prisma.user.findUnique({
      where: { email: 'admin@dongseoro.com' }
    });
    
    if (user) {
      console.log('\n업데이트된 관리자 계정:');
      console.log('- 이메일:', user.email);
      console.log('- 이름:', user.name);
      console.log('- 역할:', user.role);
      console.log('- 비밀번호 해시 길이:', user.password.length);
    }
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateAdminPassword();
