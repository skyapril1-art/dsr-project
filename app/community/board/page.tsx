"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function CommunityBoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkSession();
    loadPosts();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error('세션 확인 오류:', error);
    }
  };

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/community');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('게시글 로드 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c69d6c]"></div>
          <p className="mt-4 text-gray-600">게시글을 불러오고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">커뮤니티 게시판</h1>
          <p className="text-gray-600">함께 나누는 믿음의 공간</p>
        </div>
        {/* 글쓰기 버튼 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">게시글 목록</h2>
          {currentUser ? (
            <Link
              href="/community/write"
              className="bg-[#c69d6c] hover:bg-[#b8906b] text-white px-4 py-2 rounded-lg transition flex items-center space-x-2"
            >
              <i className="fa-solid fa-pen"></i>
              <span>글쓰기</span>
            </Link>
          ) : (
            <div className="text-sm text-gray-500">
              <Link href="/login" className="text-[#c69d6c] hover:underline">
                로그인
              </Link>하시면 글을 작성할 수 있습니다.
            </div>
          )}
        </div>

        {/* 게시글 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm text-gray-700">
            <div className="col-span-1 text-center">번호</div>
            <div className="col-span-6">제목</div>
            <div className="col-span-2 text-center">작성자</div>
            <div className="col-span-3 text-center">작성일</div>
          </div>
          
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <Link 
                key={post.id}
                href={`/community/board/${post.id}`}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="col-span-1 text-center text-sm text-gray-600">
                  {posts.length - index}
                </div>
                <div className="col-span-6">
                  <h3 className="text-sm font-medium text-gray-900 hover:text-[#c69d6c] transition truncate">
                    {post.title}
                  </h3>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sm text-gray-700">{post.author.name}</span>
                </div>
                <div className="col-span-3 text-center">
                  <span className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-comments text-gray-400 text-2xl"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">아직 게시글이 없습니다</h3>
              <p className="text-gray-500 mb-6">첫 번째 게시글을 작성해보세요!</p>
              {currentUser && (
                <Link
                  href="/community/write"
                  className="inline-flex items-center space-x-2 bg-[#c69d6c] hover:bg-[#b8906b] text-white px-6 py-3 rounded-lg transition"
                >
                  <i className="fa-solid fa-pen"></i>
                  <span>글쓰기</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* 페이지네이션 (나중에 구현) */}
        {posts.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex space-x-2">
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                이전
              </button>
              <button className="px-3 py-2 text-sm font-medium text-white bg-[#c69d6c] border border-[#c69d6c] rounded-md">
                1
              </button>
              <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                다음
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}