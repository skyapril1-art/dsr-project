import { PageHeader, Card, FeatureCard, Icon, InfoItem, COLORS } from "@/app/components/ui";
import prisma from "@/app/lib/prisma";

async function getEvents() {
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: [
        { eventType: 'asc' },
        { order: 'asc' }
      ]
    });
    return events;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
}

const CONTACT_INFO = {
  phone: '교회 사무실',
  email: 'info@dongseoro.or.kr'
} as const;

// Components
const UpcomingEventCard = ({ event }: { event: any }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="md:flex">
      <div className="md:w-1/3">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="h-48 w-full object-cover"
          />
        ) : (
          <div className="h-48 bg-gray-300 flex items-center justify-center">
            <Icon name="calendar-days" className="text-4xl text-gray-500" />
          </div>
        )}
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

const PastEventCard = ({ event }: { event: any }) => (
  <Card hover className="bg-white">
    <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
    <InfoItem icon="calendar" label={new Date(event.date).toLocaleDateString('ko-KR')} />
    <p className="text-sm text-gray-600 mt-2">{event.description}</p>
    <div className="mt-4 pt-3 border-t border-gray-100">
      <span className="text-sm text-gray-500">참석 인원: </span>
      <span className="font-bold text-blue-600">{event.participants}명</span>
    </div>
  </Card>
);

const RegularEventCard = ({ event }: { event: any }) => (
  <FeatureCard 
    icon={event.icon || 'calendar'} 
    title={event.title} 
    description={event.description}
  />
);

export default async function EventsPage() {
  const allEvents = await getEvents();
  
  const upcomingEvents = allEvents.filter(e => e.eventType === 'upcoming');
  const pastEvents = allEvents.filter(e => e.eventType === 'past');
  const regularEvents = allEvents.filter(e => e.eventType === 'regular');
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
          {upcomingEvents.map((event, index) => (
            <UpcomingEventCard key={index} event={event} />
          ))}
        </div>
      </section>

      {/* 지난 행사 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">지난 행사</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event, index) => (
            <PastEventCard key={index} event={event} />
          ))}
        </div>
      </section>

      {/* 정기 행사 안내 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">정기 행사</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regularEvents.map((event, index) => (
            <RegularEventCard key={index} event={event} />
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