import Image from "next/image";

export default function Home() {
  return (
    <div className="space-y-12">
      {/* 메인 이미지 */}
      <div className="relative">
        <div className="w-full h-96 bg-gradient-to-r from-[#c69d6c] to-[#b8926a] rounded-lg shadow-lg"></div>
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">동서로교회</h1>
            <p className="text-lg md:text-xl">하나님의 사랑이 넘치는 곳</p>
          </div>
        </div>
      </div>

      {/* 환영 메시지 */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">동서로교회에 오신 것을 환영합니다</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          우리는 하나님의 말씀을 중심으로 한 신앙 공동체입니다. 
          모든 사람이 하나님의 사랑을 경험하고 성장할 수 있는 곳입니다.
          함께 예배하고, 교제하며, 섬기는 기쁨을 나누어요.
        </p>
      </section>

      {/* 예배 안내 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">예배 안내</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4 text-[#c69d6c]">주일 예배</h4>
            <div className="space-y-2 text-gray-600">
              <p><strong>1부:</strong> 오전 8:00</p>
              <p><strong>2부:</strong> 오전 10:30</p>
              <p><strong>3부:</strong> 오후 2:00</p>
              <p><strong>장소:</strong> 본당</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4 text-[#c69d6c]">수요 예배</h4>
            <div className="space-y-2 text-gray-600">
              <p><strong>시간:</strong> 오후 7:30</p>
              <p><strong>장소:</strong> 본당</p>
              <p><strong>내용:</strong> 말씀과 기도</p>
            </div>
          </div>
        </div>
      </section>

      {/* 교회 소개 */}
      <section className="py-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">교회 소개</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-heart text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">사랑</h4>
            <p className="text-gray-600">하나님의 사랑을 경험하고 나누는 공동체</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-book text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">말씀</h4>
            <p className="text-gray-600">성경 말씀을 중심으로 한 신앙 생활</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-hands text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">섬김</h4>
            <p className="text-gray-600">서로 섬기고 지역사회를 사랑하는 교회</p>
          </div>
        </div>
      </section>

      {/* 연락처 */}
      <section className="bg-[#c69d6c] text-white p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-center mb-6">오시는 길</h3>
        <div className="text-center space-y-2">
          <p className="text-lg"><i className="fa-solid fa-location-dot mr-2"></i>전라북도 익산시 동서로 179-49</p>
          <p className="text-lg"><i className="fa-solid fa-phone mr-2"></i>문의: 교회 사무실</p>
          <p className="text-lg"><i className="fa-brands fa-youtube mr-2"></i>온라인 예배도 함께하세요</p>
        </div>
      </section>
    </div>
  );
}
