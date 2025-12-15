import Image from "next/image";

export default function MinistryPage() {
  const ministries = [
    {
      name: "예배팀",
      description: "하나님께 영광을 돌리는 예배를 인도합니다.",
      activities: ["찬양", "연주", "음향", "영상"],
      icon: "fa-music"
    },
    {
      name: "교육팀",
      description: "말씀으로 다음 세대를 양육합니다.",
      activities: ["주일학교", "청년부", "성경공부", "제자훈련"],
      icon: "fa-book"
    },
    {
      name: "전도팀",
      description: "복음을 전하고 영혼을 구원합니다.",
      activities: ["노방전도", "심방", "전도대회", "선교"],
      icon: "fa-heart"
    },
    {
      name: "봉사팀",
      description: "사랑으로 교회와 지역사회를 섬깁니다.",
      activities: ["청소", "주차안내", "식당봉사", "구제"],
      icon: "fa-hands"
    },
    {
      name: "기술팀",
      description: "기술로 하나님의 일에 동참합니다.",
      activities: ["방송", "홈페이지", "음향시설", "영상편집"],
      icon: "fa-computer"
    },
    {
      name: "행정팀",
      description: "교회 운영을 체계적으로 관리합니다.",
      activities: ["재정관리", "문서관리", "행사기획", "시설관리"],
      icon: "fa-building"
    }
  ];

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
          <div className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="relative w-full h-80 mx-auto mb-4 rounded-lg overflow-hidden">
              <Image 
                src="/images/ministry/담임목사.png"
                alt="담임목사"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">담임목사</h3>
            <p className="text-gray-600">교회를 이끌고 말씀을 전합니다</p>
          </div>
          
          <div className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="relative w-full h-80 mx-auto mb-4 rounded-lg overflow-hidden">
              <Image 
                src="/images/ministry/부목사.png"
                alt="부목사"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">부목사</h3>
            <p className="text-gray-600">교육과 양육을 담당합니다</p>
          </div>
          
          <div className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="relative w-full h-80 mx-auto mb-4 rounded-lg overflow-hidden">
              <Image 
                src="/images/ministry/전도사.png"
                alt="전도사"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">전도사</h3>
            <p className="text-gray-600">전도와 심방을 담당합니다</p>
          </div>
        </div>
      </section>

      {/* 사역팀 카드들 */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ministries.map((ministry, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fa-solid ${ministry.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{ministry.name}</h3>
            </div>
            <p className="text-gray-600 mb-4 text-center">{ministry.description}</p>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">주요 활동</h4>
              <ul className="space-y-1">
                {ministry.activities.map((activity, actIndex) => (
                  <li key={actIndex} className="text-sm text-gray-600">
                    • {activity}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-4 border-t">
              <button className="w-full bg-[#c69d6c] text-white py-2 rounded hover:opacity-90 transition">
                참여 문의
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 사역 참여 안내 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">사역 참여 안내</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#c69d6c]">사역 참여 절차</h3>
            <ol className="space-y-2 text-gray-600">
              <li>1. 관심 있는 사역팀 선택</li>
              <li>2. 해당 팀장과 상담</li>
              <li>3. 사역 오리엔테이션 참석</li>
              <li>4. 사역 시작</li>
            </ol>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#c69d6c]">사역자의 자세</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• 겸손한 마음으로 섬기기</li>
              <li>• 팀원들과 협력하기</li>
              <li>• 지속적인 성장 추구</li>
              <li>• 하나님께 영광 돌리기</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <button className="bg-[#c69d6c] text-white px-8 py-3 rounded-lg hover:opacity-90 transition">
            사역 참여 신청하기
          </button>
        </div>
      </section>

      {/* 연락처 정보 */}
      <section className="bg-[#c69d6c] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">사역 문의</h2>
        <p className="mb-4">각 사역팀에 대한 자세한 문의는 교회 사무실로 연락해주세요.</p>
        <p className="text-lg">
          <i className="fa-solid fa-phone mr-2"></i>
          전화: 교회 사무실
        </p>
      </section>
    </div>
  );
}