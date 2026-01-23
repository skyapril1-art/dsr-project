import { PageHeader, Card, FeatureCard, Icon, InfoItem, COLORS } from "@/app/components/ui";
import type { Event, PastEvent } from "@/app/lib/types";

// Constants
const UPCOMING_EVENTS: Event[] = [
  {
    title: "2024년 부활절 연합예배",
    date: "2024-03-31",
    time: "오전 10:30",
    location: "본당",
    description: "예수님의 부활을 기념하는 특별 연합예배입니다.",
    image: "/images/easter.jpg"
  },
  {
    title: "청년부 수련회",
    date: "2024-04-15",
    time: "금요일 ~ 일요일",
    location: "수양관",
    description: "청년들의 신앙 성장과 교제를 위한 수련회입니다.",
    image: "/images/retreat.jpg"
  },
  {
    title: "어린이날 특별행사",
    date: "2024-05-05",
    time: "오후 2:00",
    location: "교육관",
    description: "어린이들을 위한 특별한 프로그램과 선물이 준비되어 있습니다.",
    image: "/images/children.jpg"
  }
] as const;

const PAST_EVENTS: PastEvent[] = [
  {
    title: "2024년 신년 예배",
    date: "2024-01-01",
    description: "새해를 하나님께 맡기는 신년 감사예배를 드렸습니다.",
    participants: 450
  },
  {
    title: "성탄절 특별예배",
    date: "2023-12-25",
    description: "예수님의 탄생을 축하하는 성탄절 칸타타와 특별예배",
    participants: 520
  },
  {
    title: "추수감사절 예배",
    date: "2023-11-26",
    description: "한 해 동안 주신 은혜에 감사하는 추수감사절 예배",
    participants: 380
  }
] as const;

const REGULAR_EVENTS = [
  { icon: 'calendar-week', title: '주일예배', description: '매주 주일 정기 예배' },
  { icon: 'pray', title: '수요예배', description: '매주 수요일 저녁' },
  { icon: 'users', title: '목장모임', description: '매주 가정에서' },
  { icon: 'sun', title: '새벽예배', description: '매일 새벽 6시' }
] as const;

const CONTACT_INFO = {
  phone: '교회 사무실',
  email: 'info@dongseoro.or.kr'
} as const;

// Components
const UpcomingEventCard = ({ event }: { event: Event }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="md:flex">
      <div className="md:w-1/3">
        <div className="h-48 bg-gray-300 flex items-center justify-center">
          <Icon name="calendar-days" className="text-4xl text-gray-500" />
        </div>
      </div>
      <div className="md:w-2/3 p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
        </div>
        <div className="space-y-2 mb-4">
          <InfoItem icon="calendar">{event.date}</InfoItem>
          <InfoItem icon="clock">{event.time}</InfoItem>
          <InfoItem icon="location-dot">{event.location}</InfoItem>
        </div>
        <p className="text-gray-600">{event.description}</p>
      </div>
    </div>
  </div>
);

const PastEventCard = ({ event }: { event: PastEvent }) => (
  <Card>
    <div className="mb-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
      <p className="text-sm text-gray-500">{event.date}</p>
    </div>
    <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500">
        참석자: {event.participants}명
      </span>
      <button 
        className="text-sm hover:underline"
        style={{ color: COLORS.PRIMARY }}
      >
        자세히 보기
      </button>
    </div>
  </Card>
);

export default function EventsPage() {
  return (
    <div className="py-12 space-y-12">
      <PageHeader 
        title="교회 행사" 
        description="동서로교회의 다양한 행사와 특별 프로그램을 안내해드립니다." 
      />

      {/* 예정된 행사 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">예정된 행사</h2>
        <div className="space-y-8">
          {UPCOMING_EVENTS.map((event, index) => (
            <UpcomingEventCard key={index} event={event} />
          ))}
        </div>
      </section>

      {/* 지난 행사 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">지난 행사</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PAST_EVENTS.map((event, index) => (
            <PastEventCard key={index} event={event} />
          ))}
        </div>
      </section>

      {/* 정기 행사 안내 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">정기 행사</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REGULAR_EVENTS.map((event, index) => (
            <FeatureCard 
              key={index}
              icon={event.icon}
              title={event.title}
              description={event.description}
              color={COLORS.PRIMARY}
            />
          ))}
        </div>
      </section>

      {/* 행사 문의 */}
      <section 
        className="text-white p-8 rounded-lg text-center"
        style={{ backgroundColor: COLORS.PRIMARY }}
      >
        <h2 className="text-2xl font-bold mb-4">행사 문의</h2>
        <p className="mb-4">교회 행사에 대한 문의사항이 있으시면 언제든 연락해주세요.</p>
        <div className="space-y-2">
          <p>
            <Icon name="phone" className="mr-2" />
            전화: {CONTACT_INFO.phone}
          </p>
          <p>
            <Icon name="envelope" className="mr-2" />
            이메일: {CONTACT_INFO.email}
          </p>
        </div>
      </section>
    </div>
  );
}