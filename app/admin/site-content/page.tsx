"use client";
import { useState, useEffect } from 'react';

interface SiteContent {
  id: number;
  key: string;
  title: string;
  content: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
  updatedAt: string;
}

interface MainSlide {
  id: number;
  imageUrl: string;
  title: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function SiteContentPage() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [slides, setSlides] = useState<MainSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    isActive: true
  });
  const [newSlideUrl, setNewSlideUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchContents();
    fetchSlides();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/admin/site-content');
      if (response.ok) {
        const data = await response.json();
        // 메인화면 관련 콘텐츠만 필터링 (환영 메시지, 예배안내, 교회소개)
        const mainContents = data.filter((item: SiteContent) => 
          item.key === 'welcome_title' || 
          item.key === 'welcome_message' ||
          item.key === 'worship_sunday' ||
          item.key === 'worship_wednesday' ||
          item.key === 'intro_love' ||
          item.key === 'intro_word' ||
          item.key === 'intro_service'
        );
        setContents(mainContents);
      }
    } catch (error) {
      console.error('콘텐츠 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/slides');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('슬라이드 로딩 오류:', error);
    }
  };

  const addSlide = async () => {
    if (!newSlideUrl.trim()) {
      setMessage({ type: 'error', text: '이미지 경로를 입력해주세요.' });
      return;
    }

    try {
      const response = await fetch('/api/admin/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newSlideUrl })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '슬라이드가 추가되었습니다!' });
        setNewSlideUrl('');
        fetchSlides();
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || '추가에 실패했습니다.' });
      }
    } catch (error) {
      console.error('슬라이드 추가 오류:', error);
      setMessage({ type: 'error', text: '오류가 발생했습니다.' });
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        
        // 업로드된 이미지로 슬라이드 추가
        const slideResponse = await fetch('/api/admin/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: data.imageUrl })
        });

        if (slideResponse.ok) {
          setMessage({ type: 'success', text: '이미지가 업로드되고 슬라이드가 추가되었습니다!' });
          fetchSlides();
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || '업로드에 실패했습니다.' });
      }
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      setMessage({ type: 'error', text: '오류가 발생했습니다.' });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else {
      setMessage({ type: 'error', text: '이미지 파일만 업로드할 수 있습니다.' });
    }
  };

  const deleteSlide = async (id: number) => {
    if (!confirm('이 슬라이드를 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/admin/slides/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '슬라이드가 삭제되었습니다.' });
        fetchSlides();
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      console.error('슬라이드 삭제 오류:', error);
      setMessage({ type: 'error', text: '삭제에 실패했습니다.' });
    }
  };

  const toggleSlideActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchSlides();
        setMessage({ type: 'success', text: '상태가 변경되었습니다.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      console.error('상태 변경 오류:', error);
    }
  };

  const handleEdit = (content: SiteContent) => {
    setEditingId(content.id);
    setFormData({
      title: content.title || '',
      content: content.content || '',
      imageUrl: content.imageUrl || '',
      isActive: content.isActive
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', imageUrl: '', isActive: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId) return;

    try {
      const response = await fetch(`/api/admin/site-content/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '콘텐츠가 성공적으로 수정되었습니다!' });
        fetchContents();
        handleCancel();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || '수정에 실패했습니다.' });
      }
    } catch (error) {
      console.error('수정 오류:', error);
      setMessage({ type: 'error', text: '오류가 발생했습니다.' });
    }
  };

  const toggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/site-content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        fetchContents();
        setMessage({ type: 'success', text: '상태가 변경되었습니다.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 2000);
      }
    } catch (error) {
      console.error('상태 변경 오류:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">메인화면 콘텐츠 관리</h1>
        <p className="text-gray-600">메인 페이지 상단의 환영 메시지 제목과 내용을 관리합니다.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* 환영 메시지 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🏠 환영 메시지</h2>
        <div className="grid gap-6">
          {contents
            .filter(content => content.key === 'welcome_title' || content.key === 'welcome_message')
            .sort((a, b) => a.order - b.order)
            .map((content) => (
              <div key={content.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {editingId === content.id ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    제목
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    내용
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이미지 URL (선택사항)
                  </label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/images/..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`active-${content.id}`}
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor={`active-${content.id}`} className="text-sm text-gray-700">
                    활성화
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-800">
                        {content.key === 'welcome_title' && '📌 메인화면 제목'}
                        {content.key === 'welcome_message' && '📝 메인화면 내용'}
                        {content.key === 'worship_sunday' && '🕐 주일예배'}
                        {content.key === 'worship_wednesday' && '🕖 수요예배'}
                        {content.key === 'intro_love' && '❤️ 사랑의 교회'}
                        {content.key === 'intro_word' && '📖 말씀의 교회'}
                        {content.key === 'intro_service' && '🙏 섬김의 교회'}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        content.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {content.isActive ? '활성화' : '비활성화'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {content.key}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(content)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <i className="fa-solid fa-pen mr-1"></i>
                      수정
                    </button>
                    <button
                      onClick={() => toggleActive(content.id, content.isActive)}
                      className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                        content.isActive 
                          ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' 
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <i className={`fa-solid ${content.isActive ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                      {content.isActive ? '비활성화' : '활성화'}
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-3">
                  <p className="text-gray-700 whitespace-pre-wrap">{content.content}</p>
                </div>

                {content.imageUrl && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">이미지:</p>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{content.imageUrl}</code>
                  </div>
                )}

                <div className="text-xs text-gray-500 border-t pt-3 mt-3">
                  마지막 수정: {new Date(content.updatedAt).toLocaleString('ko-KR')}
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* 예배 안내 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">⛪ 예배 안내</h2>
        <div className="grid gap-6">
          {contents
            .filter(content => content.key === 'worship_sunday' || content.key === 'worship_wednesday')
            .sort((a, b) => a.order - b.order)
            .map((content) => (
              <div key={content.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {editingId === content.id ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">내용</label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">이미지 URL (선택사항)</label>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/images/..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`active-${content.id}`}
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor={`active-${content.id}`} className="text-sm text-gray-700">활성화</label>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">저장</button>
                      <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">취소</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-gray-800">
                            {content.key === 'welcome_title' && '📌 메인화면 제목'}
                            {content.key === 'welcome_message' && '📝 메인화면 내용'}
                            {content.key === 'worship_sunday' && '🕐 주일예배'}
                            {content.key === 'worship_wednesday' && '🕖 수요예배'}
                            {content.key === 'intro_love' && '❤️ 사랑의 교회'}
                            {content.key === 'intro_word' && '📖 말씀의 교회'}
                            {content.key === 'intro_service' && '🙏 섬김의 교회'}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            content.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {content.isActive ? '활성화' : '비활성화'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">{content.key}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(content)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          <i className="fa-solid fa-pen mr-1"></i>수정
                        </button>
                        <button onClick={() => toggleActive(content.id, content.isActive)} className={`px-4 py-2 rounded-lg text-white transition-colors text-sm ${
                          content.isActive ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'
                        }`}>
                          <i className={`fa-solid ${content.isActive ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                          {content.isActive ? '비활성화' : '활성화'}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">제목:</p>
                      <p className="text-lg font-semibold text-gray-800">{content.title}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-gray-700 whitespace-pre-wrap">{content.content}</p>
                    </div>
                    {content.imageUrl && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">이미지:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{content.imageUrl}</code>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 border-t pt-3 mt-3">
                      마지막 수정: {new Date(content.updatedAt).toLocaleString('ko-KR')}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* 교회 소개 섹션 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🤝 교회 소개</h2>
        <div className="grid gap-6">
          {contents
            .filter(content => content.key === 'intro_love' || content.key === 'intro_word' || content.key === 'intro_service')
            .sort((a, b) => a.order - b.order)
            .map((content) => (
              <div key={content.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {editingId === content.id ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">내용</label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">이미지 URL (선택사항)</label>
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/images/..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`active-${content.id}`}
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <label htmlFor={`active-${content.id}`} className="text-sm text-gray-700">활성화</label>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">저장</button>
                      <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">취소</button>
                    </div>
                  </form>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-xl font-bold text-gray-800">
                            {content.key === 'welcome_title' && '📌 메인화면 제목'}
                            {content.key === 'welcome_message' && '📝 메인화면 내용'}
                            {content.key === 'worship_sunday' && '🕐 주일예배'}
                            {content.key === 'worship_wednesday' && '🕖 수요예배'}
                            {content.key === 'intro_love' && '❤️ 사랑의 교회'}
                            {content.key === 'intro_word' && '📖 말씀의 교회'}
                            {content.key === 'intro_service' && '🙏 섬김의 교회'}
                          </h2>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            content.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {content.isActive ? '활성화' : '비활성화'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">{content.key}</span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(content)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          <i className="fa-solid fa-pen mr-1"></i>수정
                        </button>
                        <button onClick={() => toggleActive(content.id, content.isActive)} className={`px-4 py-2 rounded-lg text-white transition-colors text-sm ${
                          content.isActive ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'
                        }`}>
                          <i className={`fa-solid ${content.isActive ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                          {content.isActive ? '비활성화' : '활성화'}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">제목:</p>
                      <p className="text-lg font-semibold text-gray-800">{content.title}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-gray-700 whitespace-pre-wrap">{content.content}</p>
                    </div>
                    {content.imageUrl && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 mb-1">이미지:</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{content.imageUrl}</code>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 border-t pt-3 mt-3">
                      마지막 수정: {new Date(content.updatedAt).toLocaleString('ko-KR')}
                    </div>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* 슬라이드 관리 섹션 */}
      <div className="mt-12 border-t pt-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">메인 슬라이드 관리</h2>
          <p className="text-gray-600">메인 페이지의 슬라이드 이미지를 추가하고 관리합니다.</p>
        </div>

        {/* 이미지 업로드 영역 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg mb-6 border-2 border-dashed border-blue-300">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <i className="fa-solid fa-cloud-arrow-up mr-2"></i>
            이미지 업로드
          </h3>
          
          {/* 드래그 앤 드롭 영역 */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragActive 
                ? 'border-blue-500 bg-blue-100' 
                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            
            {uploading ? (
              <div className="py-4">
                <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
                <p className="text-gray-700 font-semibold">업로드 중...</p>
              </div>
            ) : (
              <>
                <i className="fa-solid fa-image text-5xl text-gray-400 mb-4"></i>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  이미지를 드래그하여 놓거나 클릭하여 선택하세요
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  JPG, JPEG, PNG, GIF, WEBP 형식 지원 (최대 10MB)
                </p>
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-folder-open mr-2"></i>
                  파일 선택
                </label>
              </>
            )}
          </div>
        </div>

        {/* 수동 경로 입력 (선택사항) */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            <i className="fa-solid fa-link mr-2"></i>
            또는 이미지 경로 직접 입력
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSlideUrl}
              onChange={(e) => setNewSlideUrl(e.target.value)}
              placeholder="/images/gallery/파일명.jpg"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addSlide}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <i className="fa-solid fa-plus mr-2"></i>
              추가
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            💡 예시: /images/gallery/메인사진.jpg
          </p>
        </div>

        {/* 슬라이드 목록 */}
        <div className="grid md:grid-cols-2 gap-4">
          {slides.map((slide) => (
            <div key={slide.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-700">#{slide.order}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    slide.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {slide.isActive ? '활성화' : '비활성화'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSlideActive(slide.id, slide.isActive)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      slide.isActive 
                        ? 'bg-gray-300 text-gray-700 hover:bg-gray-400' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <i className={`fa-solid ${slide.isActive ? 'fa-eye-slash' : 'fa-eye'} mr-1`}></i>
                    {slide.isActive ? '비활성화' : '활성화'}
                  </button>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    <i className="fa-solid fa-trash mr-1"></i>
                    삭제
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-2 mb-2">
                <code className="text-sm text-gray-700 break-all">{slide.imageUrl}</code>
              </div>

              {slide.title && (
                <p className="text-sm text-gray-600 mb-1">
                  <strong>제목:</strong> {slide.title}
                </p>
              )}

              <div className="text-xs text-gray-500 mt-2">
                생성: {new Date(slide.createdAt).toLocaleString('ko-KR')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
