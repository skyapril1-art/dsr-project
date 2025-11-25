"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('회원가입이 완료되었습니다.');
        window.location.href = '/login';
      } else {
        alert(data.error || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-10">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h1 className="flex justify-center text-2xl font-bold mb-6">회원가입</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">이름</label>
            <input 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              className="w-full h-11 border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-[#c69d6c]"
              required
            />
          </div>
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
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">비밀번호 확인</label>
            <input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full h-11 border rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-[#c69d6c]" 
              required
            />
          </div>
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-sm text-blue-800">
              <i className="fa-solid fa-info-circle mr-2"></i>
              모든 새 계정은 일반 사용자로 생성됩니다. 관리자 권한이 필요한 경우 기존 관리자에게 문의하세요.
            </p>
          </div>
          <button 
            type="submit" 
            className="w-full h-11 rounded-lg bg-[#c69d6c] text-white font-semibold hover:opacity-90 transition"
          >
            가입하기
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요? 
            <Link href="/login" className="text-[#c69d6c] hover:underline ml-1">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}