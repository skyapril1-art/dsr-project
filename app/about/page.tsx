import Image from "next/image";
import { PageHeader, Card, TimelineItem, COLORS } from "@/app/components/ui";
import prisma from "@/app/lib/prisma";

async function getAboutContent() {
  try {
    const contents = await prisma.aboutContent.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    });
    
    // content를 안전하게 파싱
    return contents.map(c => {
      let parsedContent = c.content;
      
      if (typeof c.content === 'string') {
        try {
          parsedContent = JSON.parse(c.content);
        } catch (e) {
          // JSON 파싱 실패 시 원본 문자열 사용
          parsedContent = c.content;
        }
      }
      
      return {
        ...c,
        content: parsedContent
      };
    });
  } catch (error) {
    console.error('Failed to fetch about content:', error);
    return [];
  }
}

// Fallback data
const FALLBACK_DATA = {
  vision: { title: '우리의 비전', content: '예수 그리스도의 사랑을 전하며, 모든 성도가 하나님의 말씀 안에서 성장하고 세상을 변화시키는 건강한 교회가 되는 것입니다.' },
  mission: { title: '우리의 사명', content: '예배를 통해 하나님께 영광을 돌리고, 말씀을 통해 제자를 양육하며, 사랑을 통해 지역사회를 섬기는 것입니다.' },
  history: [
    { year: '1990년', description: '동서로교회 개척' },
    { year: '2000년', description: '새 성전 건축 및 이전' },
    { year: '2010년', description: '선교관 증축' },
    { year: '2020년', description: '온라인 예배 시스템 구축' }
  ],
  pastors: [
    { image: '/images/ministry/담임목사.png', title: '담임목사', description: '말씀과 기도로 교회를 섬기고 있습니다.' },
    { image: '/images/ministry/부목사.png', title: '부목사', description: '청년부와 교육 사역을 담당하고 있습니다.' },
    { image: '/images/ministry/전도사.png', title: '전도사', description: '어린이와 청소년 사역을 섬기고 있습니다.' }
  ],
  worship: {
    sunday: { title: '주일 예배', times: ['1부 예배: 오전 8:00', '2부 예배: 오전 10:30', '3부 예배: 오후 2:00', '주일학교: 오전 10:30'] },
    weekday: { title: '주중 예배', times: ['수요예배: 수요일 오후 7:30', '새벽예배: 매일 오전 6:00', '금요기도회: 금요일 오후 7:30'] }
  }
};

export default async function AboutPage() {
  const contents = await getAboutContent();
  
  // Parse content by key
  const contentMap = new Map(contents.map(c => [c.key, c]));
  
  // Vision & Mission
  const visionContent = contentMap.get('vision');
  const visionData = visionContent && typeof visionContent.content === 'object' 
    ? visionContent.content as any 
    : null;
  
  const visionMission = visionData 
    ? [
        { title: '우리의 비전', content: visionData.vision || FALLBACK_DATA.vision.content },
        { title: '우리의 사명', content: visionData.mission || FALLBACK_DATA.mission.content }
      ]
    : [FALLBACK_DATA.vision, FALLBACK_DATA.mission];
  
  // History
  const historyContent = contentMap.get('history');
  const history = historyContent && Array.isArray(historyContent.content)
    ? (historyContent.content as Array<{year: string, event: string}>).map(item => ({
        year: item.year,
        description: item.event
      }))
    : FALLBACK_DATA.history;
  
  // Pastor
  const pastorContent = contentMap.get('pastor');
  const pastorData = pastorContent && Array.isArray(pastorContent.content)
    ? pastorContent.content as Array<any>
    : null;
  
  const pastors = pastorData
    ? pastorData.map(p => ({
        image: p.imageUrl || '/images/ministry/담임목사.png',
        name: p.name || '목회자',
        education: p.education || '',
        experience: p.experience || '',
        message: p.message || ''
      }))
    : FALLBACK_DATA.pastors.map(p => ({
        image: p.image,
        name: p.title,
        education: '',
        experience: '',
        message: p.description
      }));
  
  // Worship Schedule
  const worshipContent = contentMap.get('worship');
  const worshipData = worshipContent && Array.isArray(worshipContent.content)
    ? worshipContent.content as Array<{day: string, time: string, location: string}>
    : null;
  
  const worshipSchedule = worshipData
    ? {
        sunday: {
          title: '주일 예배',
          times: worshipData.filter(w => w.day.includes('주일')).map(w => `${w.day}: ${w.time} (${w.location})`)
        },
        weekday: {
          title: '주중 예배',
          times: worshipData.filter(w => !w.day.includes('주일')).map(w => `${w.day}: ${w.time} (${w.location})`)
        }
      }
    : FALLBACK_DATA.worship;
  return (
    <div className="py-12 space-y-12">
      <PageHeader 
        title="교회 소개" 
        description="동서로교회는 하나님의 사랑 안에서 함께 성장하는 신앙 공동체입니다." 
      />

      {/* 비전과 미션 */}
      <section className="grid md:grid-cols-2 gap-8">
        {visionMission.map((item, index) => (
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
          {history.map((item, index) => (
            <TimelineItem key={index} year={item.year} description={item.description} />
          ))}
        </div>
      </section>

      {/* 목회진 소개 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">목회진 소개</h2>
        <div className="space-y-6">
          {pastors.map((pastor, index) => (
            <Card key={index} className="overflow-hidden" hover>
              <div className="flex flex-col md:flex-row gap-6">
                {/* 사진 */}
                <div className="relative w-full md:w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={pastor.image}
                    alt={pastor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* 정보 */}
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800">{pastor.name}</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {pastor.education && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">
                          <i className="fa-solid fa-graduation-cap mr-2"></i>학력
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {pastor.education}
                        </p>
                      </div>
                    )}
                    
                    {pastor.experience && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">
                          <i className="fa-solid fa-briefcase mr-2"></i>경력
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                          {pastor.experience}
                        </p>
                      </div>
                    )}
                    
                    {pastor.message && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">
                          <i className="fa-solid fa-comment mr-2"></i>한마디
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed italic">
                          "{pastor.message}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
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
          {Object.values(worshipSchedule).map((schedule, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-4">{schedule.title}</h3>
              <ul className="space-y-2">
                {schedule.times.map((time: string, timeIndex: number) => (
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