"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();

      if (response.ok && data.isAdmin) {
        setIsAdmin(true);
        setCurrentUser(data.user);
        await loadUsers();
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('관리자 권한 확인 오류:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('사용자 목록 로드 오류:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#c69d6c]"></div>
          <p className="mt-4 text-gray-600">권한을 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <i className="fa-solid fa-users text-blue-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">총 사용자</h3>
              <p className="text-2xl font-bold text-blue-600">{users.length}명</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <i className="fa-solid fa-user-shield text-green-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">관리자</h3>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(user => user.role === 'admin').length}명
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <i className="fa-solid fa-calendar text-purple-600 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">오늘 가입</h3>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(user => {
                  const today = new Date().toDateString();
                  const userDate = new Date(user.createdAt).toDateString();
                  return today === userDate;
                }).length}명
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 사용자 증감 그래프 */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">사용자 가입 추이</h2>
          <p className="text-sm text-gray-600 mt-1">최근 7일간 일일 가입자 수</p>
        </div>
        <div className="p-6">
          <div className="relative">
            {(() => {
              // 데이터 준비
              const chartData = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toDateString();
                
                const count = users.filter(user => {
                  const userDate = new Date(user.createdAt).toDateString();
                  return userDate === dateStr;
                }).length;
                
                return {
                  date,
                  count,
                  label: `${date.getMonth() + 1}/${date.getDate()}`
                };
              });

              const maxCount = Math.max(...chartData.map(d => d.count), 1);
              const chartHeight = 256;
              const padding = { left: 20, right: 20, top: 20, bottom: 40 };
              const width = 800;
              const graphHeight = chartHeight - padding.top - padding.bottom;
              const graphWidth = width - padding.left - padding.right;

              // 좌표 계산
              const points = chartData.map((d, i) => ({
                x: padding.left + (i / (chartData.length - 1)) * graphWidth,
                y: padding.top + graphHeight - (d.count / maxCount) * graphHeight,
                ...d
              }));

              // SVG path 생성
              const linePath = points.map((p, i) => 
                `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`
              ).join(' ');

              // 면적 path 생성
              const areaPath = `${linePath} L ${points[points.length - 1].x},${chartHeight - padding.bottom} L ${points[0].x},${chartHeight - padding.bottom} Z`;

              return (
                <div>
                  {/* SVG 그래프 */}
                  <svg 
                    width="100%" 
                    height={chartHeight}
                    viewBox={`0 0 ${width} ${chartHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    className="overflow-visible"
                  >
                    {/* 격자선 */}
                    {[0, 1, 2, 3, 4].map(i => (
                      <line
                        key={i}
                        x1={padding.left}
                        y1={padding.top + (i / 4) * graphHeight}
                        x2={width - padding.right}
                        y2={padding.top + (i / 4) * graphHeight}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}

                    {/* 세로 격자선 */}
                    {points.map((p, i) => (
                      <line
                        key={i}
                        x1={p.x}
                        y1={padding.top}
                        x2={p.x}
                        y2={chartHeight - padding.bottom}
                        stroke="#f3f4f6"
                        strokeWidth="1"
                      />
                    ))}

                    {/* 그라디언트 정의 */}
                    <defs>
                      <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* 면적 채우기 */}
                    <path
                      d={areaPath}
                      fill="url(#areaGradient)"
                    />

                    {/* 선 그래프 */}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* 데이터 포인트 */}
                    {points.map((p, i) => (
                      <g key={i} className="group">
                        {/* 호버 영역 (투명, 넓음) */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="15"
                          fill="transparent"
                          className="cursor-pointer"
                        />
                        {/* 실제 포인트 */}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          fill="white"
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                          className="pointer-events-none transition-all group-hover:r-[7]"
                        />
                        {/* SVG 툴팁 */}
                        <g className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <rect
                            x={p.x - 20}
                            y={p.y - 35}
                            width="40"
                            height="20"
                            rx="4"
                            fill="#1f2937"
                          />
                          <text
                            x={p.x}
                            y={p.y - 21}
                            textAnchor="middle"
                            fill="white"
                            fontSize="12"
                            fontWeight="500"
                          >
                            {p.count}명
                          </text>
                        </g>
                      </g>
                    ))}
                  </svg>

                  {/* X축 레이블 */}
                  <div className="flex items-center justify-between px-5 mt-4">
                    {chartData.map((d, i) => (
                      <div key={i} className="flex-1 text-xs text-gray-600 text-center">
                        {d.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}