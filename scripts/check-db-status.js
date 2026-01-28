require('dotenv/config');
const { PrismaClient } = require('../app/generated/prisma/index.js');

async function checkDatabaseStatus() {
  const prisma = new PrismaClient();
  
  try {
    console.log('=== 데이터베이스 상태 확인 ===\n');
    
    // 사용자 수
    const userCount = await prisma.user.count();
    console.log(`✅ User: ${userCount}명`);
    
    // 게시글 수
    const postCount = await prisma.post.count();
    console.log(`✅ Post: ${postCount}개`);
    
    // 댓글 수
    const commentCount = await prisma.comment.count();
    console.log(`✅ Comment: ${commentCount}개`);
    
    // 슬라이드 수
    const slideCount = await prisma.mainSlide.count();
    console.log(`✅ MainSlide: ${slideCount}개`);
    
    // 사이트 콘텐츠 수
    const contentCount = await prisma.siteContent.count();
    console.log(`✅ SiteContent: ${contentCount}개`);
    
    // 커뮤니티 수
    const communityCount = await prisma.community.count();
    console.log(`✅ Community: ${communityCount}개`);
    
    // 간증 수
    const testimonialCount = await prisma.testimonial.count();
    console.log(`✅ Testimonial: ${testimonialCount}개`);
    
    // 행사 수
    const eventCount = await prisma.event.count();
    console.log(`✅ Event: ${eventCount}개`);
    
    // About 콘텐츠 수
    const aboutCount = await prisma.aboutContent.count();
    console.log(`✅ AboutContent: ${aboutCount}개`);
    
    // 목회자 수
    const pastorCount = await prisma.pastor.count();
    console.log(`✅ Pastor: ${pastorCount}명`);
    
    // 사역팀 수
    const teamCount = await prisma.ministryTeam.count();
    console.log(`✅ MinistryTeam: ${teamCount}개`);
    
    // 사역 정보 수
    const ministryInfoCount = await prisma.ministryInfo.count();
    console.log(`✅ MinistryInfo: ${ministryInfoCount}개`);
    
    // Family360 콘텐츠 수
    const family360Count = await prisma.family360Content.count();
    console.log(`✅ Family360Content: ${family360Count}개`);
    
    console.log('\n=== 관리자 계정 확인 ===');
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@dongseoro.com' }
    });
    
    if (admin) {
      console.log(`✅ 관리자 계정 존재`);
      console.log(`   - 이메일: ${admin.email}`);
      console.log(`   - 이름: ${admin.name}`);
      console.log(`   - 역할: ${admin.role}`);
      console.log(`   - 비밀번호 해시 길이: ${admin.password.length}`);
    } else {
      console.log(`❌ 관리자 계정이 없습니다.`);
    }
    
    console.log('\n=== 최근 게시글 확인 ===');
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    
    if (recentPosts.length > 0) {
      console.log(`최근 게시글 ${recentPosts.length}개:`);
      recentPosts.forEach(post => {
        console.log(`  - "${post.title}" by ${post.author.name} (${post.createdAt})`);
      });
    } else {
      console.log('게시글이 없습니다.');
    }
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStatus();
