'use client';

import { useEffect, useState } from 'react';

// Types
interface Community {
  id: number;
  name: string;
  leader: string;
  area: string;
  members: number;
  meetingDay: string;
  description: string | null;
  isActive: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  community: string;
  content: string;
  imageUrl: string | null;
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

interface InfoCardProps {
  title: string;
  items: readonly string[];
  isOrdered?: boolean;
}

// Constants
const PRIMARY_COLOR = '#c69d6c';

const FEATURES = [
  {
    icon: 'fa-home',
    title: '가정적 분위기',
    description: '가족같은 따뜻한 분위기에서 서로를 돌봅니다'
  },
  {
    icon: 'fa-book-open',
    title: '말씀 나눔',
    description: '하나님의 말씀을 함께 읽고 나누며 적용합니다'
  },
  {
    icon: 'fa-pray',
    title: '기도와 교제',
    description: '서로를 위해 기도하고 삶을 나누며 교제합니다'
  }
] as const;

const PARTICIPATION_INFO = {
  method: {
    title: '참여 방법',
    items: [
      '거주 지역에 맞는 목장 선택',
      '해당 목자에게 연락',
      '목장 모임 참석',
      '정식 목원으로 등록'
    ]
  },
  activities: {
    title: '목장 활동',
    items: [
      '매주 정기 모임',
      '성경 공부 및 나눔',
      '서로를 위한 기도',
      '목장 친교 활동',
      '생일 축하 및 경조사'
    ]
  }
} as const;

// Components
const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="text-center">
    <div 
      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
      style={{ backgroundColor: PRIMARY_COLOR }}
      aria-hidden="true"
    >
      <i className={`fa-solid ${icon} text-white text-2xl`}></i>
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const InfoCard = ({ title, items, isOrdered = false }: InfoCardProps) => (
  <div>
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {isOrdered ? (
      <ol className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>{index + 1}. {item}</li>
        ))}
      </ol>
    ) : (
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    )}
  </div>
);

const CommunityCard = ({ community }: { community: Community }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{community.name}</h3>
      <p className="text-sm" style={{ color: PRIMARY_COLOR }}>
        목자: {community.leader}
      </p>
    </div>
    
    <div className="space-y-2 mb-4">
      <p className="flex items-center text-sm text-gray-600">
        <i className="fa-solid fa-location-dot mr-2" aria-hidden="true"></i>
        <span>{community.area}</span>
      </p>
      <p className="flex items-center text-sm text-gray-600">
        <i className="fa-solid fa-users mr-2" aria-hidden="true"></i>
        <span>목원 {community.members}명</span>
      </p>
      <p className="flex items-center text-sm text-gray-600">
        <i className="fa-solid fa-calendar mr-2" aria-hidden="true"></i>
        <span>{community.meetingDay}</span>
      </p>
    </div>
    
    {community.description && (
      <p className="text-gray-600 text-sm">{community.description}</p>
    )}
  </div>
);

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => (
  <div className="bg-white p-6 rounded-lg">
    <div className="flex items-center mb-4">
      <div className={`w-12 h-12 rounded-full mr-4 overflow-hidden flex-shrink-0 ${!testimonial.imageUrl ? 'bg-gray-300' : ''}`}>
        {testimonial.imageUrl ? (
          <img 
            src={testimonial.imageUrl} 
            alt={`${testimonial.name}의 프로필`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" aria-hidden="true">
            <i className="fa-solid fa-user text-gray-500"></i>
          </div>
        )}
      </div>
      <div>
        <h4 className="font-semibold">{testimonial.name}</h4>
        <p className="text-sm text-gray-500">{testimonial.community}</p>
      </div>
    </div>
    <p className="text-gray-600">{testimonial.content}</p>
  </div>
);

const LoadingSpinner = () => (
  <div className="py-12 flex items-center justify-center" role="status" aria-live="polite">
    <div className="text-lg text-gray-600">로��� 중...</div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center text-gray-500" role="status">
    {message}
  </div>
);

// Main Component
export default function CommunityGroupPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [communitiesRes, testimonialsRes] = await Promise.all([
        fetch('/api/community'),
        fetch('/api/testimonials')
      ]);

      if (communitiesRes.ok) {
        const data = await communitiesRes.json();
        setCommunities(data.communities || []);
      } else {
        console.error('목장 데이터 불러오기 실패:', communitiesRes.status);
      }

      if (testimonialsRes.ok) {
        const data = await testimonialsRes.json();
        setTestimonials(data.testimonials || []);
      } else {
        console.error('간증 데이터 불러오기 실패:', testimonialsRes.status);
      }
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-12">
      {/* 목장 소개 헤더 */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">목장 소개</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          가정과 같은 따뜻함으로 서로를 돌보며 함께 성장하는 소그룹 공동체입니다.
        </p>
      </section>

      {/* 목장이란? */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">목장이란?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* 목장 목록 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">목장 안내</h2>
        {communities.length === 0 ? (
          <EmptyState message="등록된 목장이 없습니다." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}
      </section>

      {/* 목장 참여 안내 */}
      <section 
        className="text-white p-8 rounded-lg"
        style={{ backgroundColor: PRIMARY_COLOR }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">목장 참여 안내</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <InfoCard 
            title={PARTICIPATION_INFO.method.title}
            items={PARTICIPATION_INFO.method.items}
            isOrdered
          />
          <InfoCard 
            title={PARTICIPATION_INFO.activities.title}
            items={PARTICIPATION_INFO.activities.items}
          />
        </div>
      </section>

      {/* 목장 간증 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">목장 간증</h2>
        {testimonials.length === 0 ? (
          <EmptyState message="등록된 간증이 없습니다." />
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}