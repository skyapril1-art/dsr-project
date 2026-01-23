const { PrismaClient } = require('../app/generated/prisma');

const prisma = new PrismaClient();

async function main() {
  console.log('행사 초기 데이터 생성 중...');

  // 예정된 행사
  const upcomingEvents = [
    {
      title: '2026년 부활절 연합예배',
      date: '2026-04-05',
      time: '오전 10:30',
      location: '본당',
      description: '예수님의 부활을 기념하는 특별 연합예배입니다.',
      eventType: 'upcoming',
      order: 1
    },
    {
      title: '청년부 수련회',
      date: '2026-05-15',
      time: '금요일 ~ 일요일',
      location: '수양관',
      description: '청년들의 신앙 성장과 교제를 위한 수련회입니다.',
      eventType: 'upcoming',
      order: 2
    },
    {
      title: '어린이날 특별행사',
      date: '2026-05-05',
      time: '오후 2:00',
      location: '교육관',
      description: '어린이들을 위한 특별한 프로그램과 선물이 준비되어 있습니다.',
      eventType: 'upcoming',
      order: 3
    }
  ];

  for (const event of upcomingEvents) {
    await prisma.event.create({
      data: event
    });
  }

  // 지난 행사
  const pastEvents = [
    {
      title: '2026년 신년 예배',
      date: '2026-01-01',
      time: '오전 10:30',
      location: '본당',
      description: '새해를 하나님께 맡기는 신년 감사예배를 드렸습니다.',
      eventType: 'past',
      participants: 450,
      order: 1
    },
    {
      title: '성탄절 특별예배',
      date: '2025-12-25',
      time: '오전 10:30',
      location: '본당',
      description: '예수님의 탄생을 축하하는 성탄절 칸타타와 특별예배',
      eventType: 'past',
      participants: 520,
      order: 2
    }
  ];

  for (const event of pastEvents) {
    await prisma.event.create({
      data: event
    });
  }

  // 정기 행사
  const regularEvents = [
    {
      title: '주일예배',
      date: '매주 주일',
      time: '오전 8:00, 10:30, 오후 2:00',
      location: '본당',
      description: '매주 주일 정기 예배',
      eventType: 'regular',
      order: 1
    },
    {
      title: '수요예배',
      date: '매주 수요일',
      time: '오후 7:30',
      location: '본당',
      description: '매주 수요일 저녁 예배',
      eventType: 'regular',
      order: 2
    },
    {
      title: '목장모임',
      date: '매주',
      time: '요일별 상이',
      location: '각 가정',
      description: '매주 가정에서 드리는 목장 모임',
      eventType: 'regular',
      order: 3
    },
    {
      title: '새벽예배',
      date: '매일',
      time: '오전 6:00',
      location: '본당',
      description: '매일 새벽 6시 새벽기도회',
      eventType: 'regular',
      order: 4
    }
  ];

  for (const event of regularEvents) {
    await prisma.event.create({
      data: event
    });
  }

  console.log('행사 초기 데이터 생성 완료!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
