import Image from "next/image";
import { PageHeader, Card, TimelineItem, COLORS } from "@/app/components/ui";

// Constants
const VISION_MISSION = [
  {
    title: '우리의 비전',
    content: '예수 그리스도의 사랑을 전하며, 모든 성도가 하나님의 말씀 안에서 성장하고 세상을 변화시키는 건강한 교회가 되는 것입니다.'
  },
  {
    title: '우리의 사명',
    content: '예배를 통해 하나님께 영광을 돌리고, 말씀을 통해 제자를 양육하며, 사랑을 통해 지역사회를 섬기는 것입니다.'
  }
] as const;

const HISTORY = [
  { year: '1990년', description: '동서로교회 개척' },
  { year: '2000년', description: '새 성전 건축 및 이전' },
  { year: '2010년', description: '선교관 증축' },
  { year: '2020년', description: '온라인 예배 시스템 구축' }
] as const;

const PASTORS = [
  {
    image: '/images/ministry/담임목사.png',
    title: '담임목사',
    description: '말씀과 기도로 교회를 섬기고 있습니다.'
  },
  {
    image: '/images/ministry/부목사.png',
    title: '부목사',
    description: '청년부와 교육 사역을 담당하고 있습니다.'
  },
  {
    image: '/images/ministry/전도사.png',
    title: '전도사',
    description: '어린이와 청소년 사역을 섬기고 있습니다.'
  }
] as const;

const WORSHIP_SCHEDULE = {
  sunday: {
    title: '주일 예배',
    times: [
      '1부 예배: 오전 8:00',
      '2부 예배: 오전 10:30',
      '3부 예배: 오후 2:00',
      '주일학교: 오전 10:30'
    ]
  },
  weekday: {
    title: '주중 예배',
    times: [
      '수요예배: 수요일 오후 7:30',
      '새벽예배: 매일 오전 6:00',
      '금요기도회: 금요일 오후 7:30'
    ]
  }
} as const;

export default function AboutPage() {
  return (
    <div className="py-12 space-y-12">
      <PageHeader 
        title="교회 소개" 
        description="동서로교회는 하나님의 사랑 안에서 함께 성장하는 신앙 공동체입니다." 
      />

      {/* 비전과 미션 */}
      <section className="grid md:grid-cols-2 gap-8">
        {VISION_MISSION.map((item, index) => (
          <Card key={index}>
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.PRIMARY }}>
              {item.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">{item.content}</p>
          </Card>
        ))}
      </section>

      {/* 교회 연혁 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">교회 연혁</h2>
        <div className="space-y-6">
          {HISTORY.map((item, index) => (
            <TimelineItem key={index} year={item.year} description={item.description} />
          ))}
        </div>
      </section>

      {/* 목회진 소개 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">목회진 소개</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PASTORS.map((pastor, index) => (
            <Card key={index} className="text-center" hover>
              <div className="relative w-full h-80 mx-auto mb-4 rounded-lg overflow-hidden">
                <Image
                  src={pastor.image}
                  alt={pastor.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">{pastor.title}</h3>
              <p className="text-gray-600">{pastor.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* 예배 시간 안내 */}
      <section 
        className="text-white p-8 rounded-lg"
        style={{ backgroundColor: COLORS.PRIMARY }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">예배 시간 안내</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {Object.values(WORSHIP_SCHEDULE).map((schedule, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-4">{schedule.title}</h3>
              <ul className="space-y-2">
                {schedule.times.map((time, timeIndex) => (
                  <li key={timeIndex}>• {time}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}