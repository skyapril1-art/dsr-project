'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

interface Pastor {
  id: number;
  name: string;
  position: string;
  description: string | null;
  imageUrl: string;
  order: number;
}

interface MinistryTeam {
  id: number;
  name: string;
  description: string;
  activities: string;
  icon: string;
  order: number;
}

interface MinistryInfo {
  key: string;
  title: string;
  content: string;
}

export default function MinistryPage() {
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [teams, setTeams] = useState<MinistryTeam[]>([]);
  const [participationGuide, setParticipationGuide] = useState<any>(null);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 목회자 정보 가져오기
        const pastorsRes = await fetch('/api/ministry/pastors');
        const pastorsData = await pastorsRes.json();
        if (pastorsRes.ok) setPastors(pastorsData.pastors);

        // 사역팀 정보 가져오기
        const teamsRes = await fetch('/api/ministry/teams');
        const teamsData = await teamsRes.json();
        if (teamsRes.ok) setTeams(teamsData.teams);

        // 참여안내 및 문의 정보 가져오기
        const infoRes = await fetch('/api/ministry/info');
        const infoData = await infoRes.json();
        if (infoRes.ok) {
          const participation = infoData.ministryInfos.find((info: MinistryInfo) => info.key === 'participation_guide');
          const contact = infoData.ministryInfos.find((info: MinistryInfo) => info.key === 'contact_info');
          
          if (participation) setParticipationGuide(JSON.parse(participation.content));
          if (contact) setContactInfo(JSON.parse(contact.content));
        }
      } catch (error) {
        console.error('데이터 로딩 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="py-12 space-y-12">
      {/* 사역팀 소개 헤더 */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">사역팀</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          각자의 은사를 따라 하나님의 나라를 위해 헌신하는 사역팀들을 소개합니다.
        </p>
      </section>

      {/* 목회자 소개 */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">목회자</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pastors.length > 0 ? (
            pastors.map((pastor) => (
              <div key={pastor.id} className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
                <div className="relative w-full h-80 mx-auto mb-4 rounded-lg overflow-hidden">
                  <Image 
                    src={pastor.imageUrl}
                    alt={pastor.position}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{pastor.position}</h3>
                <p className="text-gray-600">{pastor.description || `${pastor.name} ${pastor.position}`}</p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">목회자 정보가 없습니다.</div>
          )}
        </div>
      </section>

      {/* 사역팀 카드들 */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.length > 0 ? (
          teams.map((team) => {
            const activities = JSON.parse(team.activities);
            return (
              <div key={team.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className={`fa-solid ${team.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
                </div>
                <p className="text-gray-600 mb-4 text-center">{team.description}</p>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">주요 활동</h4>
                  <ul className="space-y-1">
                    {activities.map((activity: string, actIndex: number) => (
                      <li key={actIndex} className="text-sm text-gray-600">
                        • {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center text-gray-500">사역팀 정보가 없습니다.</div>
        )}
      </section>

      {/* 사역 참여 안내 */}
      {participationGuide && (
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">사역 참여 안내</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#c69d6c]">사역 참여 절차</h3>
              <ol className="space-y-2 text-gray-600">
                {participationGuide.procedure?.map((item: string, idx: number) => (
                  <li key={idx}>{idx + 1}. {item}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#c69d6c]">사역자의 자세</h3>
              <ul className="space-y-2 text-gray-600">
                {participationGuide.attitude?.map((item: string, idx: number) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 연락처 정보 */}
      {contactInfo && (
        <section className="bg-[#c69d6c] text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">사역 문의</h2>
          <p className="mb-4">{contactInfo.description}</p>
          <p className="text-lg">
            <i className="fa-solid fa-phone mr-2"></i>
            전화: {contactInfo.phone}
          </p>
        </section>
      )}
    </div>
  );
}