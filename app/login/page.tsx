"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // 컴포넌트 마운트 시 기존 세션 확인 및 정리
  useEffect(() => {
    const clearOldSession = async () => {
      try {
        // 기존 세션이 있는지 확인
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          // 유효하지 않은 세션이면 로그아웃 요청으로 쿠키 삭제
          await fetch('/api/auth/session', {
            method: 'DELETE',
            credentials: 'include'
          });
        }
      } catch (error) {
        console.log('기존 세션 정리 중 오류 (무시해도 됨):', error);
      }
    };
    
    clearOldSession();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('로그인 응답:', response.status, data);

      if (response.ok) {
        console.log('로그인 성공, 리다이렉트 중...');
        alert('로그인 성공!');
        // alert 닫힌 후 리다이렉트
        setTimeout(() => {
          console.log('페이지 이동 시작');
          window.location.href = '/';
        }, 50);
      } else {
        alert(data.error || '로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="flex justify-center text-2xl font-bold mb-6">로그인</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">이메일</label>
            <input 
              id="email" 
              name="email" 
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-11 border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-[#c69d6c]" 
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">비밀번호</label>
            <input 
              id="password" 
              name="password" 
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-11 border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-[#c69d6c]" 
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full h-11 rounded-lg bg-[#c69d6c] text-white font-semibold hover:opacity-90 transition"
          >
            로그인
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요? 
            <Link href="/signup" className="text-[#c69d6c] hover:underline ml-1">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}