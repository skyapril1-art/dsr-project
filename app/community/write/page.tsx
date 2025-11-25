"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function CommunityWritePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
      } else {
        // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('세션 확인 오류:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/community', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        router.push('/community/board');
      } else {
        const data = await response.json();
        alert(data.error || '게시글 작성에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/session', {
        method: 'DELETE',
      });
      
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
          <p className="mt-4 text-gray-600">로그인 상태를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">로그인이 필요합니다</h1>
          <p className="text-gray-600 mb-6">글을 작성하려면 로그인해주세요.</p>
          <Link 
            href="/login"
            className="bg-[#c69d6c] hover:bg-[#b8906b] text-white px-6 py-3 rounded-lg transition"
          >
            로그인하기
          </Link>
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
              <h1 className="text-2xl font-bold">글쓰기</h1>
              <p className="text-sm opacity-90">새로운 게시글을 작성해보세요</p>
            </div>
            <div className="flex items-center space-x-4">
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
              <Link 
                href="/community/board"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition"
              >
                목록으로
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            {/* 제목 입력 */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="게시글 제목을 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c69d6c] focus:border-transparent"
                disabled={isSubmitting}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/100자
              </p>
            </div>

            {/* 내용 입력 */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                rows={15}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="게시글 내용을 입력해주세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#c69d6c] focus:border-transparent resize-vertical"
                disabled={isSubmitting}
                maxLength={5000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length}/5,000자
              </p>
            </div>

            {/* 작성자 정보 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#c69d6c] rounded-full flex items-center justify-center text-white font-medium">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentUser.name}</p>
                  <p className="text-sm text-gray-500">{currentUser.email}</p>
                </div>
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-4">
              <Link
                href="/community/board"
                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-6 py-3 bg-[#c69d6c] hover:bg-[#b8906b] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>작성 중...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-pen"></i>
                    <span>게시글 작성</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* 작성 안내 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            <i className="fa-solid fa-info-circle mr-2"></i>
            게시글 작성 안내
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 교회 공동체에 적합한 건전한 내용으로 작성해주세요.</li>
            <li>• 다른 성도들에게 도움이 되는 은혜로운 나눔을 부탁드립니다.</li>
            <li>• 개인정보나 민감한 정보는 포함하지 말아주세요.</li>
            <li>• 제목은 100자, 내용은 5,000자 이내로 작성해주세요.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}