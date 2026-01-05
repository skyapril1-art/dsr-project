export default function Family360Page() {
  return (
    <div className="py-12 space-y-12">
      {/* 가정교회360 소개 헤더 */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">가정교회 360</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          가정에서 시작되는 전인적 신앙 교육과 영성 훈련 프로그램입니다.
        </p>
      </section>

      {/* 가정교회360이란? */}
      <section className="bg-gradient-to-r from-[#c69d6c] to-[#b8926a] text-white p-8 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">가정교회 360이란?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-home text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">가정 중심</h3>
            <p className="text-sm opacity-90">
              가정을 교회의 기초 단위로 하여 신앙을 전수하는 시스템
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-sync-alt text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">360도 접근</h3>
            <p className="text-sm opacity-90">
              영적, 정서적, 지적, 사회적 모든 영역을 포괄하는 전인교육
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-seedling text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-2">지속적 성장</h3>
            <p className="text-sm opacity-90">
              평생에 걸친 신앙 성장과 제자도의 실현
            </p>
          </div>
        </div>
      </section>

      {/* 프로그램 구성 */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">프로그램 구성</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-baby text-red-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">영유아부</h3>
            <p className="text-sm text-gray-600">0-5세</p>
            <p className="text-sm text-gray-600">기초 신앙 형성</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-child text-yellow-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">어린이부</h3>
            <p className="text-sm text-gray-600">6-12세</p>
            <p className="text-sm text-gray-600">성경 이야기와 신앙 교육</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-user-graduate text-green-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">청소년부</h3>
            <p className="text-sm text-gray-600">13-18세</p>
            <p className="text-sm text-gray-600">정체성 확립과 신앙 성장</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-users text-blue-500 text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold mb-2">성인부</h3>
            <p className="text-sm text-gray-600">19세 이상</p>
            <p className="text-sm text-gray-600">제자도와 사역자 훈련</p>
          </div>
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
            <div className="text-center">
              <div className="w-12 h-12 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">신청</h4>
              <p className="text-sm text-gray-600">가정교회360 참여 신청서 작성</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">오리엔테이션</h4>
              <p className="text-sm text-gray-600">프로그램 소개 및 교육</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">시작</h4>
              <p className="text-sm text-gray-600">가정에서 프로그램 시작</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-2 text-white font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">성장</h4>
              <p className="text-sm text-gray-600">지속적인 점검과 성장</p>
            </div>
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