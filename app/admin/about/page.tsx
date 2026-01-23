"use client";
import { useState, useEffect } from 'react';

interface AboutContent {
  id: number;
  key: string;
  title: string;
  content: any;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  updatedAt: string;
}

export default function AboutManagePage() {
  const [contents, setContents] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState<'intro' | 'history' | 'pastor' | 'worship'>('intro');

  // 비전/사명 폼
  const [introForm, setIntroForm] = useState({ vision: '', mission: '' });

  // 연혁 폼
  const [historyForm, setHistoryForm] = useState<Array<{year: string, event: string}>>([]);

  // 목회진 폼
  const [pastorForm, setPastorForm] = useState<Array<{
    name: string,
    education: string,
    experience: string,
    message: string,
    imageUrl: string
  }>>([]);

  // 예배시간 폼
  const [worshipForm, setWorshipForm] = useState<Array<{day: string, time: string, location: string}>>([]);

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    if (contents.length > 0) {
      loadFormsFromContents();
    }
  }, [contents]);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/admin/about');
      if (response.ok) {
        const data = await response.json();
        setContents(data);
      }
    } catch (error) {
      console.error('콘텐츠 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFormsFromContents = () => {
    const visionContent = contents.find(c => c.key === 'vision');
    if (visionContent && typeof visionContent.content === 'object') {
      setIntroForm({
        vision: visionContent.content.vision || '',
        mission: visionContent.content.mission || ''
      });
    }

    const historyContent = contents.find(c => c.key === 'history');
    if (historyContent && Array.isArray(historyContent.content)) {
      setHistoryForm(historyContent.content);
    }

    const pastorContent = contents.find(c => c.key === 'pastor');
    if (pastorContent && Array.isArray(pastorContent.content)) {
      setPastorForm(pastorContent.content.map((p: any) => ({
        name: p.name || '',
        education: p.education || '',
        experience: p.experience || '',
        message: p.message || '',
        imageUrl: p.imageUrl || ''
      })));
    }

    const worshipContent = contents.find(c => c.key === 'worship');
    if (worshipContent && Array.isArray(worshipContent.content)) {
      setWorshipForm(worshipContent.content);
    }
  };

  const saveIntro = async () => {
    try {
      const existing = contents.find(c => c.key === 'vision');
      const url = existing ? `/api/admin/about/${existing.id}` : '/api/admin/about';
      const method = existing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'vision',
          title: 'Vision & Mission',
          content: introForm,
          order: 1,
          isActive: true
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '저장되었습니다!' });
        fetchContents();
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    }
  };

  const saveHistory = async () => {
    try {
      const existing = contents.find(c => c.key === 'history');
      const url = existing ? `/api/admin/about/${existing.id}` : '/api/admin/about';
      const method = existing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'history',
          title: 'Church History',
          content: historyForm,
          order: 2,
          isActive: true
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '저장되었습니다!' });
        fetchContents();
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    }
  };

  const savePastor = async () => {
    try {
      const existing = contents.find(c => c.key === 'pastor');
      const url = existing ? `/api/admin/about/${existing.id}` : '/api/admin/about';
      const method = existing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'pastor',
          title: 'Pastors',
          content: pastorForm,
          order: 3,
          isActive: true
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '저장되었습니다!' });
        fetchContents();
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    }
  };

  const saveWorship = async () => {
    try {
      const existing = contents.find(c => c.key === 'worship');
      const url = existing ? `/api/admin/about/${existing.id}` : '/api/admin/about';
      const method = existing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: 'worship',
          title: 'Worship Schedule',
          content: worshipForm,
          order: 4,
          isActive: true
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '저장되었습니다!' });
        fetchContents();
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const newForm = [...pastorForm];
        newForm[index].imageUrl = data.imageUrl;
        setPastorForm(newForm);
        setMessage({ type: 'success', text: '이미지가 업로드되었습니다!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: '이미지 업로드 중 오류가 발생했습니다.' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">교회소개 관리</h1>
        <p className="text-gray-600 mt-2">교회소개 페이지의 콘텐츠를 섹션별로 관리합니다.</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('intro')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'intro'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fa-solid fa-church mr-2"></i>
              교회소개 수정
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fa-solid fa-clock-rotate-left mr-2"></i>
              교회연혁 수정
            </button>
            <button
              onClick={() => setActiveTab('pastor')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'pastor'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fa-solid fa-user-tie mr-2"></i>
              목회진소개 수정
            </button>
            <button
              onClick={() => setActiveTab('worship')}
              className={`px-6 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'worship'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <i className="fa-solid fa-calendar-days mr-2"></i>
              예배시간안내 수정
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'intro' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">교회소개 수정</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비전 *
                </label>
                <textarea
                  value={introForm.vision}
                  onChange={(e) => setIntroForm({...introForm, vision: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="교회의 비전을 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사명 *
                </label>
                <textarea
                  value={introForm.mission}
                  onChange={(e) => setIntroForm({...introForm, mission: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="교회의 사명을 입력하세요"
                />
              </div>
              <button
                onClick={saveIntro}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <i className="fa-solid fa-save mr-2"></i>
                저장
              </button>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">교회연혁 수정</h2>
                <button
                  onClick={() => setHistoryForm([...historyForm, {year: '', event: ''}])}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  연혁 추가
                </button>
              </div>
              {historyForm.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연도
                    </label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) => {
                        const newForm = [...historyForm];
                        newForm[index].year = e.target.value;
                        setHistoryForm(newForm);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="2020년"
                    />
                  </div>
                  <div className="flex-[3]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      내용
                    </label>
                    <input
                      type="text"
                      value={item.event}
                      onChange={(e) => {
                        const newForm = [...historyForm];
                        newForm[index].event = e.target.value;
                        setHistoryForm(newForm);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="교회 설립"
                    />
                  </div>
                  <button
                    onClick={() => setHistoryForm(historyForm.filter((_, i) => i !== index))}
                    className="mt-7 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
              <button
                onClick={saveHistory}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <i className="fa-solid fa-save mr-2"></i>
                저장
              </button>
            </div>
          )}

          {activeTab === 'pastor' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">목회진소개 수정</h2>
                <button
                  onClick={() => setPastorForm([...pastorForm, {name: '', education: '', experience: '', message: '', imageUrl: ''}])}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  목회진 추가
                </button>
              </div>
              
              {pastorForm.map((pastor, index) => (
                <div key={index} className="p-6 bg-gray-50 rounded-lg space-y-4 relative">
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setPastorForm(pastorForm.filter((_, i) => i !== index))}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-700">목회자 #{index + 1}</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      사진
                    </label>
                    <div className="flex items-center gap-4">
                      {pastor.imageUrl && (
                        <img 
                          src={pastor.imageUrl} 
                          alt={`목회자 ${index + 1} 사진`}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, index)}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="mt-1 text-xs text-gray-500">JPG, PNG 파일 (최대 5MB)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름 *
                    </label>
                    <input
                      type="text"
                      value={pastor.name}
                      onChange={(e) => {
                        const newForm = [...pastorForm];
                        newForm[index].name = e.target.value;
                        setPastorForm(newForm);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="홍길동 목사"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      학력 *
                    </label>
                    <textarea
                      value={pastor.education}
                      onChange={(e) => {
                        const newForm = [...pastorForm];
                        newForm[index].education = e.target.value;
                        setPastorForm(newForm);
                      }}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="서울신학대학교 졸업"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      경력 *
                    </label>
                    <textarea
                      value={pastor.experience}
                      onChange={(e) => {
                        const newForm = [...pastorForm];
                        newForm[index].experience = e.target.value;
                        setPastorForm(newForm);
                      }}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="동서로교회 담임목사 (2000년~현재)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      메시지 *
                    </label>
                    <textarea
                      value={pastor.message}
                      onChange={(e) => {
                        const newForm = [...pastorForm];
                        newForm[index].message = e.target.value;
                        setPastorForm(newForm);
                      }}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="하나님의 말씀으로 세워지는 교회..."
                    />
                  </div>
                </div>
              ))}
              
              <button
                onClick={savePastor}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <i className="fa-solid fa-save mr-2"></i>
                저장
              </button>
            </div>
          )}

          {activeTab === 'worship' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">예배시간안내 수정</h2>
                <button
                  onClick={() => setWorshipForm([...worshipForm, {day: '', time: '', location: ''}])}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  예배 추가
                </button>
              </div>
              {worshipForm.map((item, index) => (
                <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      예배명
                    </label>
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) => {
                        const newForm = [...worshipForm];
                        newForm[index].day = e.target.value;
                        setWorshipForm(newForm);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="주일 1부 예배"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시간
                    </label>
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => {
                        const newForm = [...worshipForm];
                        newForm[index].time = e.target.value;
                        setWorshipForm(newForm);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="오전 9:00"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      장소
                    </label>
                    <input
                      type="text"
                      value={item.location}
                      onChange={(e) => {
                        const newForm = [...worshipForm];
                        newForm[index].location = e.target.value;
                        setWorshipForm(newForm);
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="본당"
                    />
                  </div>
                  <button
                    onClick={() => setWorshipForm(worshipForm.filter((_, i) => i !== index))}
                    className="mt-7 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
              <button
                onClick={saveWorship}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <i className="fa-solid fa-save mr-2"></i>
                저장
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
