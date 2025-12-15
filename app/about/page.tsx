import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="py-12 space-y-12">
      {/* 교회 소개 헤더 */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">교회 소개</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          동서로교회는 하나님의 사랑 안에서 함께 성장하는 신앙 공동체입니다.
        </p>
      </section>

      {/* 비전과 미션 */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#c69d6c] mb-4">우리의 비전</h2>
          <p className="text-gray-600 leading-relaxed">
            예수 그리스도의 사랑을 전하며, 모든 성도가 하나님의 말씀 안에서 
            성장하고 세상을 변화시키는 건강한 교회가 되는 것입니다.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#c69d6c] mb-4">우리의 사명</h2>
          <p className="text-gray-600 leading-relaxed">
            예배를 통해 하나님께 영광을 돌리고, 말씀을 통해 제자를 양육하며, 
            사랑을 통해 지역사회를 섬기는 것입니다.
          </p>
        </div>
      </section>

      {/* 교회 연혁 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">교회 연혁</h2>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-4 h-4 bg-[#c69d6c] rounded-full mt-2"></div>
            <div>
              <h3 className="text-lg font-semibold">1990년</h3>
              <p className="text-gray-600">동서로교회 개척</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-4 h-4 bg-[#c69d6c] rounded-full mt-2"></div>
            <div>
              <h3 className="text-lg font-semibold">2000년</h3>
              <p className="text-gray-600">새 성전 건축 및 이전</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-4 h-4 bg-[#c69d6c] rounded-full mt-2"></div>
            <div>
              <h3 className="text-lg font-semibold">2010년</h3>
              <p className="text-gray-600">선교관 증축</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-4 h-4 bg-[#c69d6c] rounded-full mt-2"></div>
            <div>
              <h3 className="text-lg font-semibold">2020년</h3>
              <p className="text-gray-600">온라인 예배 시스템 구축</p>
            </div>
          </div>
        </div>
      </section>

      {/* 목회진 소개 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">목회진 소개</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div className="relative w-full h-80 mx-auto mb-4 rounded-lg overflow-hidden">
              <Image 
                src="/images/ministry/담임목사.png"
                alt="담임목사"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">담임목사</h3>
            <p className="text-gray-600">말씀과 기도로 교회를 섬기고 있습니다.</p>
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
            <h3 className="text-xl font-semibold mb-2">부목사</h3>
            <p className="text-gray-600">청년부와 교육 사역을 담당하고 있습니다.</p>
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
            <h3 className="text-xl font-semibold mb-2">전도사</h3>
            <p className="text-gray-600">어린이와 청소년 사역을 섬기고 있습니다.</p>
          </div>
        </div>
      </section>

      {/* 예배 시간 안내 */}
      <section className="bg-[#c69d6c] text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">예배 시간 안내</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">주일 예배</h3>
            <ul className="space-y-2">
              <li>• 1부 예배: 오전 8:00</li>
              <li>• 2부 예배: 오전 10:30</li>
              <li>• 3부 예배: 오후 2:00</li>
              <li>• 주일학교: 오전 10:30</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">주중 예배</h3>
            <ul className="space-y-2">
              <li>• 수요예배: 수요일 오후 7:30</li>
              <li>• 새벽예배: 매일 오전 6:00</li>
              <li>• 금요기도회: 금요일 오후 7:30</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}