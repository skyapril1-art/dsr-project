const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  try {
    // 기존 간증 데이터가 있는지 확인
    const existingTestimonials = await prisma.testimonial.findMany();
    
    if (existingTestimonials.length > 0) {
      console.log(`이미 ${existingTestimonials.length}개의 간증이 존재합니다.`);
      
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('기존 데이터를 삭제하고 새로 생성하시겠습니까? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y') {
          await prisma.testimonial.deleteMany();
          console.log('기존 간증 데이터를 삭제했습니다.');
          await createTestimonials();
        } else {
          console.log('작업을 취소했습니다.');
        }
        rl.close();
        await prisma.$disconnect();
      });
    } else {
      await createTestimonials();
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error('오류 발생:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

async function createTestimonials() {
  const testimonials = [
    {
      name: "김성도",
      community: "믿음 목장",
      content: "목장에서 만난 형제자매들과 함께 기도하고 말씀을 나누며 많은 위로와 힘을 얻고 있습니다. 혼자였다면 견디기 어려웠을 시간들을 함께 해주셔서 감사합니다.",
      order: 1,
      isActive: true
    },
    {
      name: "이은혜",
      community: "소망 목장",
      content: "목장 가족들과 함께하는 시간이 너무 소중합니다. 서로의 기도제목을 나누고 응답받은 은혜를 함께 나누며 하나님의 살아계심을 더욱 깊이 경험하게 됩니다.",
      order: 2,
      isActive: true
    }
  ];

  console.log('간증 데이터를 생성하는 중...');

  for (const testimonialData of testimonials) {
    const testimonial = await prisma.testimonial.create({
      data: testimonialData
    });
    console.log(`✓ ${testimonial.name}의 간증 생성 완료 (ID: ${testimonial.id})`);
  }

  console.log('\n간증 초기 데이터 생성이 완료되었습니다!');
  console.log(`총 ${testimonials.length}개의 간증이 생성되었습니다.`);
}

main();
