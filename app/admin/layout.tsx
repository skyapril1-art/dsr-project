"use client";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import "@/public/fontawesome-free-6.7.2-web/css/all.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    
    // 로컬 스토리지에서 다크모드 설정 불러오기
    const savedMode = localStorage.getItem('adminDarkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data.isAdmin) {
          setIsAuthenticated(true);
        } else {
          // 관리자가 아닌 경우
          alert('관리자 권한이 필요합니다.');
          router.push('/login');
        }
      } else {
        // 세션이 없는 경우
        router.push('/login');
      }
    } catch (error) {
      console.error('인증 확인 오류:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('adminDarkMode', newMode.toString());
  };

  const menuItems = [
    {
      title: '대시보드',
      icon: 'fa-solid fa-gauge',
      href: '/admin',
    },
    {
      title: '사용자 관리',
      icon: 'fa-solid fa-users',
      href: '/admin/users',
    },
    {
      title: '메인화면 콘텐츠',
      icon: 'fa-solid fa-home',
      href: '/admin/site-content',
    },
    {
      title: '교회소개 관리',
      icon: 'fa-solid fa-church',
      href: '/admin/about',
    },
    {
      title: '사역팀 관리',
      icon: 'fa-solid fa-hands-praying',
      href: '/admin/ministry',
    },
    {
      title: '행사 관리',
      icon: 'fa-solid fa-calendar-days',
      href: '/admin/events',
    },
    {
      title: '목장 관리',
      icon: 'fa-solid fa-people-group',
      href: '/admin/community',
    },
    {
      title: '커뮤니티 관리',
      icon: 'fa-solid fa-file-lines',
      href: '/admin/posts',
    },
    {
      title: '가정교회360 관리',
      icon: 'fa-solid fa-house-user',
      href: '/admin/family360',
    },
    {
      title: '설정',
      icon: 'fa-solid fa-gear',
      href: '/admin/settings',
    },
  ];

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-white text-lg">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 (리디렉션 중)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`fixed inset-0 flex overflow-hidden ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      {/* 사이드바 */}
      <aside className={`w-64 flex flex-col ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-900 text-white'}`}>
        {/* 로고/헤더 */}
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-400 mt-1">동서로교회</p>
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <i className={`${item.icon} w-5`}></i>
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* 하단 정보 */}
        <div className="p-4 border-t border-gray-700">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
            <span>사이트로 돌아가기</span>
          </Link>
        </div>
      </aside>

      {/* 메인 컨텐츠 영역 */}
      <main className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* 상단 헤더 바 */}
        <header className={`shadow-sm ${isDarkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'}`}>
          <div className="px-8 py-4 flex items-center justify-between">
            <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
              {menuItems.find((item) => item.href === pathname)?.title || '관리자'}
            </h2>
            <div className="flex items-center space-x-4">
              {/* 다크모드 토글 버튼 */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
              >
                <i className={`${isDarkMode ? 'fa-solid fa-sun' : 'fa-solid fa-moon'} text-xl`}></i>
              </button>
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                } text-white`}>
                  <i className="fa-solid fa-user"></i>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 페이지 컨텐츠 */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
