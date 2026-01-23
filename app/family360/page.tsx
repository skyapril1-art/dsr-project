import { PageHeader, FeatureCard, Card, Icon, COLORS } from "@/app/components/ui";

// Constants
const INTRO_FEATURES = [
  {
    icon: 'home',
    title: '가정 중심',
    description: '가정을 교회의 기초 단위로 하여 신앙을 전수하는 시스템'
  },
  {
    icon: 'sync-alt',
    title: '360도 접근',
    description: '영적, 정서적, 지적, 사회적 모든 영역을 포괄하는 전인교육'
  },
  {
    icon: 'seedling',
    title: '지속적 성장',
    description: '평생에 걸친 신앙 성장과 제자도의 실현'
  }
] as const;

const PROGRAMS = [
  {
    icon: 'baby',
    title: '영유아부',
    age: '0-5세',
    description: '기초 신앙 형성',
    color: 'red'
  },
  {
    icon: 'child',
    title: '어린이부',
    age: '6-12세',
    description: '성경 이야기와 신앙 교육',
    color: 'yellow'
  },
  {
    icon: 'user-graduate',
    title: '청소년부',
    age: '13-18세',
    description: '정체성 확립과 신앙 성장',
    color: 'green'
  },
  {
    icon: 'users',
    title: '성인부',
    age: '19세 이상',
    description: '제자도와 사역자 훈련',
    color: 'blue'
  }
] as const;

const CORE_ACTIVITIES = [
  {
    title: '가정 예배',
    items: [
      '매일 가정에서 드리는 가족 예배',
      '연령별 맞춤 예배 가이드 제공',
      '가족 구성원 모두가 참여하는 프로그램',
      '계절과 절기에 맞는 특별 예배'
    ]
  },
  {
    title: '신앙 교육',
    items: [
      '체계적인 성경 교육 커리큘럼',
      '연령별 신앙 성장 단계 프로그램',
      '부모를 위한 신앙 교육 지침서',
      '정기적인 평가와 피드백'
    ]
  },
  {
    title: '생활 훈련',
    items: [
      '일상 속 신앙 실천 방법',
      '기독교 세계관 교육',
      '인성과 품성 개발 프로그램',
      '봉사와 나눔의 실천'
    ]
  },
  {
    title: '공동체 활동',
    items: [
      '가정교회 간 교제와 협력',
      '연령별 모임과 활동',
      '특별 행사와 캠프',
      '지역사회 봉사 활동'
    ]
  }
] as const;

const PARTICIPATION_STEPS = [
  { step: 1, title: '신청', description: '가정교회360 참여 신청서 작성' },
  { step: 2, title: '오리엔테이션', description: '프로그램 소개 및 교육' },
  { step: 3, title: '시작', description: '가정에서 프로그램 시작' },
  { step: 4, title: '성장', description: '지속적인 점검과 성장' }
] as const;

const STATISTICS = [
  { value: '95%', label: '프로그램 만족도' },
  { value: '150+', label: '참여 가정 수' },
  { value: '3년', label: '평균 참여 기간' }
] as const;

const TESTIMONIAL = {
  content: '가정교회360을 통해 우리 가족의 신앙이 한층 더 깊어졌습니다. 특히 아이들이 자연스럽게 신앙을 체득하며 성장하는 모습을 보며 하나님의 은혜를 매일 경험하고 있습니다.',
  author: '김성도 가정'
} as const;

// Components
const ProgramCard = ({ program }: { program: typeof PROGRAMS[number] }) => {
  const colorClasses = {
    red: 'bg-red-100',
    yellow: 'bg-yellow-100',
    green: 'bg-green-100',
    blue: 'bg-blue-100'
  };
  
  const iconColorClasses = {
    red: 'text-red-500',
    yellow: 'text-yellow-500',
    green: 'text-green-500',
    blue: 'text-blue-500'
  };
  
  return (
    <Card className="text-center">
      <div className={`w-16 h-16 ${colorClasses[program.color]} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <Icon name={program.icon} className={`${iconColorClasses[program.color]} text-2xl`} />
      </div>
      <h3 className="text-lg font-semibold mb-2">{program.title}</h3>
      <p className="text-sm text-gray-600">{program.age}</p>
      <p className="text-sm text-gray-600">{program.description}</p>
    </Card>
  );
};

const ActivitySection = ({ activity }: { activity: typeof CORE_ACTIVITIES[number] }) => (
  <div>
    <h3 className="text-xl font-semibold mb-4" style={{ color: COLORS.PRIMARY }}>
      {activity.title}
    </h3>
    <ul className="space-y-2 text-gray-600">
      {activity.items.map((item, index) => (
        <li key={index}>• {item}</li>
      ))}
    </ul>
  </div>
);

const ParticipationStep = ({ step }: { step: typeof PARTICIPATION_STEPS[number] }) => (
  <div className="text-center">
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold"
      style={{ backgroundColor: COLORS.PRIMARY }}
    >
      {step.step}
    </div>
    <h4 className="font-semibold mb-2">{step.title}</h4>
    <p className="text-sm text-gray-600">{step.description}</p>
  </div>
);

export default function Family360Page() {
  return (
    <div className="py-12 space-y-12">
      <PageHeader
        title="가정교회 360"
        description="가정에서 시작되는 전인적 신앙 교육과 영성 훈련 프로그램입니다."
      />

      {/* 가정교회360이란? */}
      <section 
        className="text-white p-8 rounded-lg" 
        style={{ 
          background: `linear-gradient(to right, ${COLORS.PRIMARY}, ${COLORS.PRIMARY_DARK})` 
        }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">가정교회 360이란?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {INTRO_FEATURES.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={feature.icon} className="text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm opacity-90">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 프로그램 구성 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">프로그램 구성</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROGRAMS.map((program, index) => (
            <ProgramCard key={index} program={program} />
          ))}
        </div>
      </section>

      {/* 핵심 활동 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">핵심 활동</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#c69d6c]">가정 예배</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 매일 가정에서 드리는 가족 예배</li>
              <li>• 연령별 맞춤 예배 가이드 제공</li>
              <li>• 가족 구성원 모두가 참여하는 프로그램</li>
              <li>• 계절과 절기에 맞는 특별 예배</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#c69d6c]">신앙 교육</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 체계적인 성경 교육 커리큘럼</li>
              <li>• 연령별 신앙 성장 단계 프로그램</li>
              <li>• 부모를 위한 신앙 교육 지침서</li>
              <li>• 정기적인 평가와 피드백</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#c69d6c]">생활 훈련</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 일상 속 신앙 실천 방법</li>
              <li>• 기독교 세계관 교육</li>
              <li>• 인성과 품성 개발 프로그램</li>
              <li>• 봉사와 나눔의 실천</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#c69d6c]">공동체 활동</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 가정교회 간 교제와 협력</li>
              <li>• 연령별 모임과 활동</li>
              <li>• 특별 행사와 캠프</li>
              <li>• 지역사회 봉사 활동</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 참여 방법 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">참여 방법</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-4">
            {PARTICIPATION_STEPS.map((step, index) => (
              <ParticipationStep key={index} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* 성과와 간증 */}
      <section className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">성과와 간증</h2>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#c69d6c] mb-2">95%</div>
            <p className="text-gray-600">프로그램 만족도</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#c69d6c] mb-2">150+</div>
            <p className="text-gray-600">참여 가정 수</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#c69d6c] mb-2">3년</div>
            <p className="text-gray-600">평균 참여 기간</p>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">참여 가정 간증</h3>
          <blockquote className="text-center text-gray-600 italic">
            "가정교회360을 통해 우리 가족의 신앙이 한층 더 깊어졌습니다. 
            특히 아이들이 자연스럽게 신앙을 체득하며 성장하는 모습을 보며 
            하나님의 은혜를 매일 경험하고 있습니다."
          </blockquote>
          <p className="text-center text-sm text-gray-500 mt-4">- 김성도 가정</p>
        </div>
      </section>

      {/* 신청 및 문의 */}
      <section className="bg-[#c69d6c] text-white p-8 rounded-lg text-center">
        <h2 className="text-3xl font-bold mb-4">가정교회 360 안내</h2>
        <p className="mb-6">
          여러분의 가정이 하나님의 사랑으로 가득한 작은 교회가 되도록 함께하세요.
        </p>
        <div className="text-sm">
          <p>문의: 교회 사무실 | 이메일: family360@dongseoro.or.kr</p>
        </div>
      </section>
    </div>
  );
}