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

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
      });
      
      setCurrentUser(null);
      router.push('/');
    } catch (error) {
      console.error('로그아웃 오류:', error);
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
      {/* 헤더 */}
      <div className="bg-[#c69d6c] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold">커뮤니티 게시판</h1>
              <p className="text-sm opacity-90">함께 나누는 믿음의 공간</p>
            </div>
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <>
                  <span className="text-sm">안녕하세요, {currentUser.name}님</span>
                  {currentUser.role === 'admin' && (
                    <Link 
                      href="/admin"
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition"
                    >
                      관리자
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <div className="space-x-2">
                  <Link 
                    href="/login"
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition"
                  >
                    로그인
                  </Link>
                  <Link 
                    href="/signup"
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition"
                  >
                    회원가입
                  </Link>
                </div>
              )}
              <Link 
                href="/"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition"
              >
                홈으로
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium text-gray-900 hover:text-[#c69d6c] transition cursor-pointer">
                    {post.title}
                  </h3>
                  <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
                </p>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-[#c69d6c] rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {post.author.name.charAt(0)}
                    </div>
                    <span className="text-gray-700 font-medium">{post.author.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-500">
                    <span className="flex items-center space-x-1">
                      <i className="fa-solid fa-eye text-xs"></i>
                      <span>0</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <i className="fa-solid fa-comment text-xs"></i>
                      <span>0</span>
                    </span>
                  </div>
                </div>
              </div>
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