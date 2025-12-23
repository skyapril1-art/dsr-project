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

export default function AdminUsersPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const response = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadUsers();
        closeDeleteModal();
      } else {
        alert('사용자 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 삭제 오류:', error);
      alert('사용자 삭제 중 오류가 발생했습니다.');
    }
  };

  const changeUserRole = async (userId: number, newRole: string) => {
    if (!confirm(`이 사용자의 역할을 ${newRole === 'admin' ? '관리자' : '일반사용자'}로 변경하시겠습니까?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        await loadUsers();
      } else {
        const data = await response.json();
        alert(data.error || '역할 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('역할 변경 오류:', error);
      alert('역할 변경 중 오류가 발생했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">권한을 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">접근 권한이 없습니다</h1>
          <p className="text-gray-600">관리자만 접근할 수 있는 페이지입니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* 페이지 제목 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">사용자 관리</h1>
        <p className="text-gray-600 mt-2">전체 사용자 목록 및 권한 관리</p>
      </div>

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

      {/* 사용자 테이블 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">사용자 목록</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이름
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  역할
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role === 'admin' ? '관리자' : '일반사용자'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.id !== currentUser?.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => changeUserRole(user.id, user.role === 'admin' ? 'user' : 'admin')}
                          className={`px-2 py-1 rounded text-xs ${
                            user.role === 'admin' 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          } transition`}
                        >
                          {user.role === 'admin' ? '일반화' : '관리자화'}
                        </button>
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-900 transition"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <i className="fa-solid fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
              사용자 삭제 확인
            </h3>
            
            <p className="text-sm text-gray-500 text-center mb-6">
              <strong>{userToDelete.name}</strong> ({userToDelete.email}) 사용자를 
              정말로 삭제하시겠습니까?<br />
              <span className="text-red-600 font-medium">이 작업은 되돌릴 수 없습니다.</span>
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
              >
                취소
              </button>
              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
