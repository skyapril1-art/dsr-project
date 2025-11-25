export default function CommunityPage() {
  const boards = [
    {
      title: "공지사항",
      description: "교회의 중요한 소식을 전합니다",
      posts: 15,
      icon: "fa-bullhorn",
      latest: "2024년 신년 예배 안내"
    },
    {
      title: "자유게시판",
      description: "교우들의 자유로운 소통 공간",
      posts: 48,
      icon: "fa-comments",
      latest: "함께 기도했으면 하는 제목들"
    },
    {
      title: "기도요청",
      description: "서로를 위한 기도 요청 게시판",
      posts: 23,
      icon: "fa-praying-hands",
      latest: "건강 회복을 위한 기도 부탁드립니다"
    },
    {
      title: "간증게시판",
      description: "하나님의 은혜를 나누는 공간",
      posts: 31,
      icon: "fa-heart",
      latest: "주님의 인도하심을 경험했습니다"
    },
    {
      title: "사진갤러리",
      description: "교회 행사와 추억을 공유합니다",
      posts: 67,
      icon: "fa-camera",
      latest: "2024년 송년 예배 사진"
    },
    {
      title: "질문과 답변",
      description: "신앙과 교회에 대한 질문 공간",
      posts: 19,
      icon: "fa-question-circle",
      latest: "성경 읽기에 대한 질문입니다"
    }
  ];

  return (
    <div className="py-12 space-y-8">
      {/* 커뮤니티 헤더 */}
      <section className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">커뮤니티</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          동서로교회 성도들의 소통과 교제의 공간입니다.
        </p>
      </section>

      {/* 게시판 목록 */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {boards.map((board, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-[#c69d6c] rounded-full flex items-center justify-center mr-4">
                <i className={`fa-solid ${board.icon} text-white`}></i>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{board.title}</h3>
                <p className="text-sm text-gray-500">게시글 {board.posts}개</p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{board.description}</p>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-1">최근 게시글</p>
              <p className="text-sm font-medium text-gray-800 truncate">{board.latest}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 최근 게시글 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">최근 게시글</h2>
        <div className="space-y-4">
          {[
            { title: "2024년 신년 예배 안내", category: "공지사항", date: "2024-01-15", author: "관리자" },
            { title: "함께 기도했으면 하는 제목들", category: "자유게시판", date: "2024-01-14", author: "김성도" },
            { title: "건강 회복을 위한 기도 부탁드립니다", category: "기도요청", date: "2024-01-13", author: "이은혜" },
            { title: "주님의 인도하심을 경험했습니다", category: "간증게시판", date: "2024-01-12", author: "박믿음" },
            { title: "2024년 송년 예배 사진", category: "사진갤러리", date: "2024-01-11", author: "사진팀" }
          ].map((post, index) => (
            <div key={index} className="bg-white p-4 rounded border hover:bg-gray-50 cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs bg-[#c69d6c] text-white px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">{post.author}</span>
                  </div>
                  <h4 className="font-medium text-gray-800 hover:text-[#c69d6c]">
                    {post.title}
                  </h4>
                </div>
                <span className="text-xs text-gray-400">{post.date}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button className="bg-[#c69d6c] text-white px-6 py-2 rounded hover:opacity-90 transition">
            더 많은 게시글 보기
          </button>
        </div>
      </section>

      {/* 글쓰기 및 이용 안내 */}
      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-[#c69d6c] text-white p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">글쓰기</h3>
          <p className="mb-4">교우 여러분의 소중한 이야기를 나누어주세요.</p>
          <button className="bg-white text-[#c69d6c] px-4 py-2 rounded hover:bg-gray-100 transition">
            새 글 작성하기
          </button>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">이용 안내</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• 로그인 후 게시글 작성이 가능합니다</li>
            <li>• 교회 예절에 맞는 언어를 사용해주세요</li>
            <li>• 개인정보는 게시하지 말아주세요</li>
            <li>• 부적절한 내용은 관리자에 의해 삭제될 수 있습니다</li>
          </ul>
        </div>
      </section>
    </div>
  );
}