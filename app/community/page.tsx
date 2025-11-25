export default function CommunityGroupPage() {
  const communities = [
    {
      name: "믿음 목장",
      leader: "김목자 성도",
      area: "익산시 중앙동 일대",
      members: 12,
      meetingDay: "화요일 오후 7시",
      description: "말씀과 기도로 함께 성장하는 목장입니다."
    },
    {
      name: "소망 목장",
      leader: "이목자 성도", 
      area: "익산시 영등동 일대",
      members: 15,
      meetingDay: "수요일 오후 7시",
      description: "서로 사랑하며 돌보는 따뜻한 목장입니다."
    },
    {
      name: "사랑 목장",
      leader: "박목자 성도",
      area: "익산시 모현동 일대", 
      members: 10,
      meetingDay: "목요일 오후 7시",
      description: "청년들이 주축이 되는 활기찬 목장입니다."
    },
    {
      name: "은혜 목장",
      leader: "최목자 성도",
      area: "익산시 부송동 일대",
      members: 18,
      meetingDay: "금요일 오후 7시", 
      description: "가족 단위로 참여하는 화목한 목장입니다."
    },
    {
      name: "평강 목장",
      leader: "정목자 성도",
      area: "익산시 신용동 일대",
      members: 14,
      meetingDay: "토요일 오후 3시",
      description: "말씀 나눔과 교제가 활발한 목장입니다."
    },
    {
      name: "기쁨 목장",
      leader: "한목자 성도",
      area: "익산시 어양동 일대", 
      members: 11,
      meetingDay: "주일 오후 3시",
      description: "찬양과 기도가 넘치는 목장입니다."
    }
  ];

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
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-home text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">가정적 분위기</h3>
            <p className="text-gray-600 text-sm">가족같은 따뜻한 분위기에서 서로를 돌봅니다</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-book-open text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">말씀 나눔</h3>
            <p className="text-gray-600 text-sm">하나님의 말씀을 함께 읽고 나누며 적용합니다</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-pray text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">기도와 교제</h3>
            <p className="text-gray-600 text-sm">서로를 위해 기도하고 삶을 나누며 교제합니다</p>
          </div>
        </div>
      </section>

      {/* 목장 목록 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">목장 안내</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{community.name}</h3>
                <p className="text-sm text-[#c69d6c]">목자: {community.leader}</p>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="flex items-center text-sm text-gray-600">
                  <i className="fa-solid fa-location-dot mr-2"></i>
                  {community.area}
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <i className="fa-solid fa-users mr-2"></i>
                  목원 {community.members}명
                </p>
                <p className="flex items-center text-sm text-gray-600">
                  <i className="fa-solid fa-calendar mr-2"></i>
                  {community.meetingDay}
                </p>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{community.description}</p>
              
              <button className="w-full bg-[#c69d6c] text-white py-2 rounded hover:opacity-90 transition">
                참여 문의
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 목장 참여 안내 */}
      <section className="bg-[#c69d6c] text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">목장 참여 안내</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">참여 방법</h3>
            <ol className="space-y-2">
              <li>1. 거주 지역에 맞는 목장 선택</li>
              <li>2. 해당 목자에게 연락</li>
              <li>3. 목장 모임 참석</li>
              <li>4. 정식 목원으로 등록</li>
            </ol>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">목장 활동</h3>
            <ul className="space-y-2">
              <li>• 매주 정기 모임</li>
              <li>• 성경 공부 및 나눔</li>
              <li>• 서로를 위한 기도</li>
              <li>• 목장 친교 활동</li>
              <li>• 생일 축하 및 경조사</li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8">
          <button className="bg-white text-[#c69d6c] px-8 py-3 rounded-lg hover:bg-gray-100 transition">
            목장 참여 신청하기
          </button>
        </div>
      </section>

      {/* 목장 간증 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">목장 간증</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">김성도</h4>
                <p className="text-sm text-gray-500">믿음 목장</p>
              </div>
            </div>
            <p className="text-gray-600">
              "목장에서 만난 형제자매들과 함께 기도하고 말씀을 나누며 
              많은 위로와 힘을 얻고 있습니다. 혼자였다면 견디기 어려웠을 
              시간들을 함께 해주셔서 감사합니다."
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">이은혜</h4>
                <p className="text-sm text-gray-500">소망 목장</p>
              </div>
            </div>
            <p className="text-gray-600">
              "목장 가족들과 함께하는 시간이 너무 소중합니다. 
              서로의 기도제목을 나누고 응답받은 은혜를 함께 나누며 
              하나님의 살아계심을 더욱 깊이 경험하게 됩니다."
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}