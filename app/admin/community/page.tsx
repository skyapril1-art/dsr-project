'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Community {
  id: number;
  name: string;
  leader: string;
  area: string;
  members: number;
  meetingDay: string;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Testimonial {
  id: number;
  name: string;
  community: string;
  content: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'community' | 'testimonial'>('community');
  
  // Community states
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    leader: '',
    area: '',
    members: 0,
    meetingDay: '',
    description: '',
    order: 0,
    isActive: true,
  });

  // Testimonial states
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const [testimonialDeleteLoading, setTestimonialDeleteLoading] = useState<number | null>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);
  const [testimonialFormData, setTestimonialFormData] = useState({
    name: '',
    community: '',
    content: '',
    imageUrl: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchCommunities();
    fetchTestimonials();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/community');
      const data = await response.json();

      if (response.ok) {
        setCommunities(data.communities);
      } else {
        setError(data.error || '커뮤니티를 불러오는데 실패했습니다.');
        if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
          router.push('/');
        }
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setTestimonialLoading(true);
      const response = await fetch('/api/admin/testimonials');
      const data = await response.json();

      if (response.ok) {
        setTestimonials(data.testimonials);
      } else {
        if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
          router.push('/');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTestimonialLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 커뮤니티를 삭제하시겠습니까?')) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await fetch(`/api/admin/community?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('커뮤니티가 삭제되었습니다.');
        setCommunities(communities.filter(c => c.id !== id));
      } else {
        alert(data.error || '커뮤니티 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/admin/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('커뮤니티가 생성되었습니다.');
        setIsCreating(false);
        resetForm();
        fetchCommunities();
      } else {
        alert(data.error || '커뮤니티 생성에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedCommunity) return;

    try {
      const response = await fetch('/api/admin/community', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedCommunity.id,
          ...formData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('커뮤니티가 수정되었습니다.');
        setIsEditing(false);
        setSelectedCommunity(null);
        resetForm();
        fetchCommunities();
      } else {
        alert(data.error || '커뮤니티 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      leader: '',
      area: '',
      members: 0,
      meetingDay: '',
      description: '',
      order: 0,
      isActive: true,
    });
  };

  const openEditModal = (community: Community) => {
    setSelectedCommunity(community);
    setFormData({
      name: community.name,
      leader: community.leader,
      area: community.area,
      members: community.members,
      meetingDay: community.meetingDay,
      description: community.description || '',
      order: community.order,
      isActive: community.isActive,
    });
    setIsEditing(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Testimonial functions
  const handleTestimonialDelete = async (id: number) => {
    if (!confirm('정말로 이 간증을 삭제하시겠습니까?')) {
      return;
    }

    try {
      setTestimonialDeleteLoading(id);
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('간증이 삭제되었습니다.');
        setTestimonials(testimonials.filter(t => t.id !== id));
      } else {
        alert(data.error || '간증 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setTestimonialDeleteLoading(null);
    }
  };

  const handleTestimonialCreate = async () => {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialFormData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('간증이 생성되었습니다.');
        setIsCreatingTestimonial(false);
        resetTestimonialForm();
        fetchTestimonials();
      } else {
        alert(data.error || '간증 생성에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleTestimonialUpdate = async () => {
    if (!selectedTestimonial) return;

    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTestimonial.id,
          ...testimonialFormData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('간증이 수정되었습니다.');
        setIsEditingTestimonial(false);
        setSelectedTestimonial(null);
        resetTestimonialForm();
        fetchTestimonials();
      } else {
        alert(data.error || '간증 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const resetTestimonialForm = () => {
    setTestimonialFormData({
      name: '',
      community: '',
      content: '',
      imageUrl: '',
      order: 0,
      isActive: true,
    });
  };

  const openEditTestimonialModal = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);
    setTestimonialFormData({
      name: testimonial.name,
      community: testimonial.community,
      content: testimonial.content,
      imageUrl: testimonial.imageUrl || '',
      order: testimonial.order,
      isActive: testimonial.isActive,
    });
    setIsEditingTestimonial(true);
  };

  if (loading || testimonialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('community')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'community'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              목장 관리
            </button>
            <button
              onClick={() => setActiveTab('testimonial')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'testimonial'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              간증 관리
            </button>
          </nav>
        </div>

        {/* Community Tab */}
        {activeTab === 'community' && (
          <>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">목장 관리</h1>
                <p className="text-gray-600">
                  총 {communities.length}개의 커뮤니티
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsCreating(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <i className="fa-solid fa-plus mr-2"></i>
                새 커뮤니티 추가
              </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순서
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    목자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    지역
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    구성원
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    모임 시간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {communities.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      등록된 커뮤니티가 없습니다.
                    </td>
                  </tr>
                ) : (
                  communities.map((community) => (
                    <tr key={community.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {community.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {community.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {community.leader}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {community.area}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {community.members}명
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {community.meetingDay}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          community.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {community.isActive ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(community)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(community.id)}
                          disabled={deleteLoading === community.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        >
                          {deleteLoading === community.id ? '삭제 중...' : '삭제'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      {/* 생성 모달 */}
      {isCreating && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setIsCreating(false);
            resetForm();
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">새 커뮤니티 추가</h2>
            </div>

            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    목장 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 믿음 목장"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    목자 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.leader}
                    onChange={(e) => setFormData({...formData, leader: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 김목자 성도"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    지역 *
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 익산시 중앙동 일대"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    구성원 수
                  </label>
                  <input
                    type="number"
                    value={formData.members}
                    onChange={(e) => setFormData({...formData, members: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    모임 시간 *
                  </label>
                  <input
                    type="text"
                    value={formData.meetingDay}
                    onChange={(e) => setFormData({...formData, meetingDay: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 화요일 오후 7시"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="목장 소개를 입력하세요"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      순서
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      활성화
                    </label>
                    <select
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">활성</option>
                      <option value="false">비활성</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsCreating(false);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                생성
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {isEditing && selectedCommunity && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setIsEditing(false);
            setSelectedCommunity(null);
            resetForm();
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">커뮤니티 수정</h2>
            </div>

            <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    목장 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    목자 이름 *
                  </label>
                  <input
                    type="text"
                    value={formData.leader}
                    onChange={(e) => setFormData({...formData, leader: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    지역 *
                  </label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    구성원 수
                  </label>
                  <input
                    type="number"
                    value={formData.members}
                    onChange={(e) => setFormData({...formData, members: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    모임 시간 *
                  </label>
                  <input
                    type="text"
                    value={formData.meetingDay}
                    onChange={(e) => setFormData({...formData, meetingDay: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설명
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      순서
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      활성화
                    </label>
                    <select
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">활성</option>
                      <option value="false">비활성</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedCommunity(null);
                  resetForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonial Tab */}
      {activeTab === 'testimonial' && (
        <>
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">간증 관리</h1>
              <p className="text-gray-600">
                총 {testimonials.length}개의 간증
              </p>
            </div>
            <button
              onClick={() => {
                resetTestimonialForm();
                setIsCreatingTestimonial(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <i className="fas fa-plus mr-2"></i>
              간증 추가
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순서
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    이름
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    목장
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    내용
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {testimonial.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{testimonial.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {testimonial.community}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md">
                      <div className="line-clamp-2">{testimonial.content}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        testimonial.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {testimonial.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditTestimonialModal(testimonial)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleTestimonialDelete(testimonial.id)}
                        disabled={testimonialDeleteLoading === testimonial.id}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                      >
                        {testimonialDeleteLoading === testimonial.id ? '삭제 중...' : '삭제'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {testimonials.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                등록된 간증이 없습니다.
              </div>
            )}
          </div>
        </>
      )}

      {/* Testimonial Create/Edit Modal */}
      {(isCreatingTestimonial || isEditingTestimonial) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">
                {isEditingTestimonial ? '간증 수정' : '간증 생성'}
              </h2>
            </div>

            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름 *
                  </label>
                  <input
                    type="text"
                    value={testimonialFormData.name}
                    onChange={(e) => setTestimonialFormData({...testimonialFormData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이름"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    목장 *
                  </label>
                  <input
                    type="text"
                    value={testimonialFormData.community}
                    onChange={(e) => setTestimonialFormData({...testimonialFormData, community: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="목장명"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    간증 내용 *
                  </label>
                  <textarea
                    value={testimonialFormData.content}
                    onChange={(e) => setTestimonialFormData({...testimonialFormData, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="간증 내용을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이미지 URL
                  </label>
                  <input
                    type="text"
                    value={testimonialFormData.imageUrl}
                    onChange={(e) => setTestimonialFormData({...testimonialFormData, imageUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      순서
                    </label>
                    <input
                      type="number"
                      value={testimonialFormData.order}
                      onChange={(e) => setTestimonialFormData({...testimonialFormData, order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      활성화
                    </label>
                    <select
                      value={testimonialFormData.isActive ? 'true' : 'false'}
                      onChange={(e) => setTestimonialFormData({...testimonialFormData, isActive: e.target.value === 'true'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">활성</option>
                      <option value="false">비활성</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditingTestimonial(false);
                  setIsCreatingTestimonial(false);
                  setSelectedTestimonial(null);
                  resetTestimonialForm();
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={isEditingTestimonial ? handleTestimonialUpdate : handleTestimonialCreate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditingTestimonial ? '수정' : '생성'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
