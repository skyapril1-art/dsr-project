'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Pastor {
  id: number;
  name: string;
  position: string;
  description: string | null;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface MinistryTeam {
  id: number;
  name: string;
  description: string;
  activities: string;
  icon: string;
  order: number;
  isActive: boolean;
}

interface MinistryInfo {
  id: number;
  key: string;
  title: string;
  content: string;
}

export default function AdminMinistryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pastors' | 'teams' | 'info'>('pastors');
  
  // Pastor states
  const [pastors, setPastors] = useState<Pastor[]>([]);
  const [pastorLoading, setPastorLoading] = useState(true);
  const [selectedPastor, setSelectedPastor] = useState<Pastor | null>(null);
  const [isEditingPastor, setIsEditingPastor] = useState(false);
  const [isCreatingPastor, setIsCreatingPastor] = useState(false);
  const [pastorFormData, setPastorFormData] = useState({
    name: '',
    position: '',
    description: '',
    imageUrl: '',
    order: 0,
    isActive: true,
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  // Team states
  const [teams, setTeams] = useState<MinistryTeam[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<MinistryTeam | null>(null);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    name: '',
    description: '',
    activities: [] as string[],
    icon: '',
    order: 0,
    isActive: true,
  });

  // Info states
  const [ministryInfos, setMinistryInfos] = useState<MinistryInfo[]>([]);
  const [infoLoading, setInfoLoading] = useState(true);
  const [participationGuide, setParticipationGuide] = useState({
    procedure: ['', '', '', ''],
    attitude: ['', '', '', ''],
  });
  const [contactInfo, setContactInfo] = useState({
    description: '',
    phone: '',
  });

  useEffect(() => {
    fetchPastors();
    fetchTeams();
    fetchMinistryInfo();
  }, []);

  // Pastor functions
  const fetchPastors = async () => {
    try {
      setPastorLoading(true);
      const response = await fetch('/api/admin/ministry/pastors');
      const data = await response.json();

      if (response.ok) {
        setPastors(data.pastors);
      } else {
        if (response.status === 403) {
          alert('관리자 권한이 필요합니다.');
          router.push('/');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPastorLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return data.imageUrl;
      } else {
        alert(data.error || '이미지 업로드에 실패했습니다.');
        return null;
      }
    } catch (err) {
      alert('이미지 업로드 중 오류가 발생했습니다.');
      console.error(err);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePastorCreate = async () => {
    try {
      // 이미지 업로드 처리
      let imageUrl = pastorFormData.imageUrl;
      if (selectedImageFile) {
        const uploadedUrl = await handleImageUpload(selectedImageFile);
        if (!uploadedUrl) {
          return; // 업로드 실패 시 중단
        }
        imageUrl = uploadedUrl;
      }

      const response = await fetch('/api/admin/ministry/pastors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...pastorFormData,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('목회자가 추가되었습니다.');
        setIsCreatingPastor(false);
        setSelectedImageFile(null);
        resetPastorForm();
        fetchPastors();
      } else {
        alert(data.error || '목회자 추가에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handlePastorUpdate = async () => {
    if (!selectedPastor) return;

    try {
      // 이미지 업로드 처리
      let imageUrl = pastorFormData.imageUrl;
      if (selectedImageFile) {
        const uploadedUrl = await handleImageUpload(selectedImageFile);
        if (!uploadedUrl) {
          return; // 업로드 실패 시 중단
        }
        imageUrl = uploadedUrl;
      }

      const response = await fetch('/api/admin/ministry/pastors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPastor.id,
          ...pastorFormData,
          imageUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('목회자 정보가 수정되었습니다.');
        setIsEditingPastor(false);
        setSelectedPastor(null);
        resetPastorForm();
        fetchPastors();
      } else {
        alert(data.error || '목회자 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handlePastorDelete = async (id: number) => {
    if (!confirm('정말로 이 목회자를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ministry/pastors?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('목회자가 삭제되었습니다.');
        fetchPastors();
      } else {
        alert(data.error || '목회자 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const resetPastorForm = () => {
    setPastorFormData({
      name: '',
      position: '',
      description: '',
      imageUrl: '',
      order: 0,
      isActive: true,
    });
    setSelectedImageFile(null);
  };

  const openEditPastorModal = (pastor: Pastor) => {
    setSelectedPastor(pastor);
    setPastorFormData({
      name: pastor.name,
      position: pastor.position,
      description: pastor.description || '',
      imageUrl: pastor.imageUrl,
      order: pastor.order,
      isActive: pastor.isActive,
    });
    setSelectedImageFile(null);
    setIsEditingPastor(true);
  };

  // Team functions
  const fetchTeams = async () => {
    try {
      setTeamLoading(true);
      const response = await fetch('/api/admin/ministry/teams');
      const data = await response.json();

      if (response.ok) {
        setTeams(data.teams);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleTeamCreate = async () => {
    try {
      const response = await fetch('/api/admin/ministry/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teamFormData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('사역팀이 추가되었습니다.');
        setIsCreatingTeam(false);
        resetTeamForm();
        fetchTeams();
      } else {
        alert(data.error || '사역팀 추가에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleTeamUpdate = async () => {
    if (!selectedTeam) return;

    try {
      const response = await fetch('/api/admin/ministry/teams', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTeam.id,
          ...teamFormData,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('사역팀이 수정되었습니다.');
        setIsEditingTeam(false);
        setSelectedTeam(null);
        resetTeamForm();
        fetchTeams();
      } else {
        alert(data.error || '사역팀 수정에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleTeamDelete = async (id: number) => {
    if (!confirm('정말로 이 사역팀을 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ministry/teams?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        alert('사역팀이 삭제되었습니다.');
        fetchTeams();
      } else {
        alert(data.error || '사역팀 삭제에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const resetTeamForm = () => {
    setTeamFormData({
      name: '',
      description: '',
      activities: [],
      icon: '',
      order: 0,
      isActive: true,
    });
  };

  const openEditTeamModal = (team: MinistryTeam) => {
    setSelectedTeam(team);
    const activitiesArray = JSON.parse(team.activities);
    setTeamFormData({
      name: team.name,
      description: team.description,
      activities: activitiesArray,
      icon: team.icon,
      order: team.order,
      isActive: team.isActive,
    });
    setIsEditingTeam(true);
  };

  // Info functions
  const fetchMinistryInfo = async () => {
    try {
      setInfoLoading(true);
      const response = await fetch('/api/admin/ministry/info');
      const data = await response.json();

      if (response.ok) {
        setMinistryInfos(data.ministryInfos);
        
        // 참여안내 데이터 파싱
        const participationData = data.ministryInfos.find((info: MinistryInfo) => info.key === 'participation_guide');
        if (participationData) {
          const parsed = JSON.parse(participationData.content);
          setParticipationGuide(parsed);
        }

        // 문의 데이터 파싱
        const contactData = data.ministryInfos.find((info: MinistryInfo) => info.key === 'contact_info');
        if (contactData) {
          const parsed = JSON.parse(contactData.content);
          setContactInfo(parsed);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInfoLoading(false);
    }
  };

  const handleSaveParticipationGuide = async () => {
    try {
      const response = await fetch('/api/admin/ministry/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'participation_guide',
          title: '사역 참여 안내',
          content: participationGuide,
        }),
      });

      if (response.ok) {
        alert('사역 참여 안내가 저장되었습니다.');
        fetchMinistryInfo();
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      const response = await fetch('/api/admin/ministry/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'contact_info',
          title: '사역 문의',
          content: contactInfo,
        }),
      });

      if (response.ok) {
        alert('사역 문의 정보가 저장되었습니다.');
        fetchMinistryInfo();
      } else {
        alert('저장에 실패했습니다.');
      }
    } catch (err) {
      alert('서버 오류가 발생했습니다.');
      console.error(err);
    }
  };

  if (pastorLoading || teamLoading || infoLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
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
              onClick={() => setActiveTab('pastors')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pastors'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              목회자 관리
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'teams'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              사역팀 관리
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              참여안내 & 문의
            </button>
          </nav>
        </div>

        {/* Pastors Tab */}
        {activeTab === 'pastors' && (
          <>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">목회자 관리</h1>
                <p className="text-gray-600">
                  총 {pastors.length}명의 목회자
                </p>
              </div>
              <button
                onClick={() => {
                  resetPastorForm();
                  setIsCreatingPastor(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <i className="fas fa-plus mr-2"></i>
                목회자 추가
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
                      직책
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      이미지 URL
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
                  {pastors.map((pastor) => (
                    <tr key={pastor.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pastor.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{pastor.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pastor.position}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {pastor.imageUrl}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          pastor.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {pastor.isActive ? '활성' : '비활성'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openEditPastorModal(pastor)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handlePastorDelete(pastor.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pastors.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  등록된 목회자가 없습니다.
                </div>
              )}
            </div>
          </>
        )}

        {/* Teams Tab */}
        {activeTab === 'teams' && (
          <>
            <div className="mb-8 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold mb-2">사역팀 관리</h1>
                <p className="text-gray-600">
                  총 {teams.length}개의 사역팀
                </p>
              </div>
              <button
                onClick={() => {
                  resetTeamForm();
                  setIsCreatingTeam(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <i className="fas fa-plus mr-2"></i>
                사역팀 추가
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => {
                const activities = JSON.parse(team.activities);
                return (
                  <div key={team.id} className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <i className={`fas ${team.icon} text-2xl text-blue-600 mr-3`}></i>
                        <h3 className="text-lg font-bold">{team.name}</h3>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        team.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {team.isActive ? '활성' : '비활성'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{team.description}</p>
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-2">주요 활동</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {activities.map((activity: string, idx: number) => (
                          <li key={idx}>• {activity}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => openEditTeamModal(team)}
                        className="text-sm text-blue-600 hover:text-blue-900"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleTeamDelete(team.id)}
                        className="text-sm text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {teams.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                등록된 사역팀이 없습니다.
              </div>
            )}
          </>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">사역 참여 안내 & 문의</h1>
            </div>

            <div className="space-y-8">
              {/* 참여안내 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">사역 참여 안내</h2>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">사역 참여 절차</h3>
                  <div className="space-y-2">
                    {participationGuide.procedure.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-gray-600">{idx + 1}.</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newProcedure = [...participationGuide.procedure];
                            newProcedure[idx] = e.target.value;
                            setParticipationGuide({
                              ...participationGuide,
                              procedure: newProcedure,
                            });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          placeholder={`절차 ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">사역자의 자세</h3>
                  <div className="space-y-2">
                    {participationGuide.attitude.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <span className="text-gray-600">•</span>
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newAttitude = [...participationGuide.attitude];
                            newAttitude[idx] = e.target.value;
                            setParticipationGuide({
                              ...participationGuide,
                              attitude: newAttitude,
                            });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                          placeholder={`자세 ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSaveParticipationGuide}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  저장
                </button>
              </div>

              {/* 문의 정보 */}
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-4">사역 문의</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      안내 문구
                    </label>
                    <textarea
                      value={contactInfo.description}
                      onChange={(e) => setContactInfo({...contactInfo, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="각 사역팀에 대한 자세한 문의는..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전화번호
                    </label>
                    <input
                      type="text"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="예: 02-1234-5678"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveContactInfo}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  저장
                </button>
              </div>
            </div>
          </>
        )}

        {/* Pastor Create/Edit Modal */}
        {(isCreatingPastor || isEditingPastor) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">
                  {isEditingPastor ? '목회자 수정' : '목회자 추가'}
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
                      value={pastorFormData.name}
                      onChange={(e) => setPastorFormData({...pastorFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      직책 *
                    </label>
                    <input
                      type="text"
                      value={pastorFormData.position}
                      onChange={(e) => setPastorFormData({...pastorFormData, position: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="예: 담임목사"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      소개
                    </label>
                    <textarea
                      value={pastorFormData.description}
                      onChange={(e) => setPastorFormData({...pastorFormData, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이미지 *
                    </label>
                    <div className="space-y-3">
                      {/* 현재 이미지 미리보기 */}
                      {(pastorFormData.imageUrl || (isEditingPastor && selectedPastor?.imageUrl)) && (
                        <div className="relative inline-block">
                          <div className="relative w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                            <img 
                              src={pastorFormData.imageUrl || selectedPastor?.imageUrl || ''} 
                              alt="미리보기" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* 파일 선택 버튼 */}
                      <div className="flex gap-2">
                        <label className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer inline-block">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSelectedImageFile(file);
                                // 미리보기용으로 URL 생성
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPastorFormData({...pastorFormData, imageUrl: reader.result as string});
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          <i className="fas fa-upload mr-2"></i>
                          {pastorFormData.imageUrl ? '이미지 변경' : '이미지 선택'}
                        </label>
                        
                        {pastorFormData.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setPastorFormData({...pastorFormData, imageUrl: ''});
                              setSelectedImageFile(null);
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            <i className="fas fa-trash mr-2"></i>
                            삭제
                          </button>
                        )}
                      </div>
                      
                      {uploadingImage && (
                        <p className="text-sm text-blue-600">
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          이미지 업로드 중...
                        </p>
                      )}
                      
                      {selectedImageFile && (
                        <p className="text-sm text-gray-600">
                          선택된 파일: {selectedImageFile.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        순서
                      </label>
                      <input
                        type="number"
                        value={pastorFormData.order}
                        onChange={(e) => setPastorFormData({...pastorFormData, order: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        활성화
                      </label>
                      <select
                        value={pastorFormData.isActive ? 'true' : 'false'}
                        onChange={(e) => setPastorFormData({...pastorFormData, isActive: e.target.value === 'true'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    setIsEditingPastor(false);
                    setIsCreatingPastor(false);
                    setSelectedPastor(null);
                    setSelectedImageFile(null);
                    resetPastorForm();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  onClick={isEditingPastor ? handlePastorUpdate : handlePastorCreate}
                  disabled={uploadingImage}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploadingImage ? '업로드 중...' : (isEditingPastor ? '수정' : '추가')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Create/Edit Modal */}
        {(isCreatingTeam || isEditingTeam) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">
                  {isEditingTeam ? '사역팀 수정' : '사역팀 추가'}
                </h2>
              </div>

              <div className="px-6 py-4 overflow-y-auto flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      팀 이름 *
                    </label>
                    <input
                      type="text"
                      value={teamFormData.name}
                      onChange={(e) => setTeamFormData({...teamFormData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명 *
                    </label>
                    <textarea
                      value={teamFormData.description}
                      onChange={(e) => setTeamFormData({...teamFormData, description: e.target.value})}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      아이콘 클래스 * (FontAwesome)
                    </label>
                    <input
                      type="text"
                      value={teamFormData.icon}
                      onChange={(e) => setTeamFormData({...teamFormData, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="예: fa-music"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주요 활동 (쉼표로 구분)
                    </label>
                    <input
                      type="text"
                      value={teamFormData.activities.join(', ')}
                      onChange={(e) => setTeamFormData({
                        ...teamFormData,
                        activities: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="예: 찬양, 연주, 음향"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        순서
                      </label>
                      <input
                        type="number"
                        value={teamFormData.order}
                        onChange={(e) => setTeamFormData({...teamFormData, order: parseInt(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        활성화
                      </label>
                      <select
                        value={teamFormData.isActive ? 'true' : 'false'}
                        onChange={(e) => setTeamFormData({...teamFormData, isActive: e.target.value === 'true'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    setIsEditingTeam(false);
                    setIsCreatingTeam(false);
                    setSelectedTeam(null);
                    resetTeamForm();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  취소
                </button>
                <button
                  onClick={isEditingTeam ? handleTeamUpdate : handleTeamCreate}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditingTeam ? '수정' : '추가'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
