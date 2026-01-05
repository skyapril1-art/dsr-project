export default function EventsPage() {
  const upcomingEvents = [
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
  ];

  const pastEvents = [
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
  ];

  return (
    <div className="py-12 space-y-12">
      {/* 행사 페이지 헤더 */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">교회 행사</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          동서로교회의 다양한 행사와 특별 프로그램을 안내해드립니다.
        </p>
      </section>

      {/* 예정된 행사 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">예정된 행사</h2>
        <div className="space-y-8">
          {upcomingEvents.map((event, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <div className="h-48 bg-gray-300 flex items-center justify-center">
                    <i className="fa-solid fa-calendar-days text-4xl text-gray-500"></i>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="flex items-center text-gray-600">
                      <i className="fa-solid fa-calendar mr-2"></i>
                      {event.date}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <i className="fa-solid fa-clock mr-2"></i>
                      {event.time}
                    </p>
                    <p className="flex items-center text-gray-600">
                      <i className="fa-solid fa-location-dot mr-2"></i>
                      {event.location}
                    </p>
                  </div>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 지난 행사 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">지난 행사</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.date}</p>
              </div>
              <p className="text-gray-600 mb-4 text-sm">{event.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  참석자: {event.participants}명
                </span>
                <button className="text-[#c69d6c] text-sm hover:underline">
                  자세히 보기
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 정기 행사 안내 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">정기 행사</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-calendar-week text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">주일예배</h3>
            <p className="text-gray-600 text-sm">매주 주일 정기 예배</p>
          </div>
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-pray text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">수요예배</h3>
            <p className="text-gray-600 text-sm">매주 수요일 저녁</p>
          </div>
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-users text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">목장모임</h3>
            <p className="text-gray-600 text-sm">매주 가정에서</p>
          </div>
          <div className="text-center bg-white p-6 rounded-lg shadow-md">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-sun text-white text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">새벽예배</h3>
            <p className="text-gray-600 text-sm">매일 새벽 6시</p>
          </div>
        </div>
      </section>

      {/* 행사 문의 */}
      <section className="bg-[#c69d6c] text-white p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">행사 문의</h2>
        <p className="mb-4">교회 행사에 대한 문의사항이 있으시면 언제든 연락해주세요.</p>
        <div className="space-y-2">
          <p><i className="fa-solid fa-phone mr-2"></i>전화: 교회 사무실</p>
          <p><i className="fa-solid fa-envelope mr-2"></i>이메일: info@dongseoro.or.kr</p>
        </div>
      </section>
    </div>
  );
}