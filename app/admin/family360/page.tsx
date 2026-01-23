"use client";
import { useState, useEffect } from "react";

interface Family360Content {
  id: number;
  key: string;
  title: string;
  content: string;
  icon: string | null;
  order: number;
  isActive: boolean;
  updatedAt: string;
}

type SectionType = "intro_feature" | "program" | "activity" | "step" | "statistic" | "intro";

const sections = [
  { id: "intro_feature" as SectionType, name: "가정교회360 메인", icon: "home", description: "메인 특징 소개" },
  { id: "program" as SectionType, name: "프로그램 구성", icon: "graduation-cap", description: "연령별 프로그램" },
  { id: "activity" as SectionType, name: "핵심 활동", icon: "list-check", description: "주요 활동 내용" },
  { id: "step" as SectionType, name: "참여 방법", icon: "stairs", description: "참여 절차 안내" },
  { id: "statistic" as SectionType, name: "성과와 간증", icon: "chart-line", description: "통계 및 성과" },
  { id: "intro" as SectionType, name: "가정교회360 안내", icon: "info-circle", description: "페이지 상단 안내 문구" },
];

export default function Family360ManagePage() {
  const [contents, setContents] = useState<Family360Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionType>("intro_feature");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    icon: "",
    order: 0,
    isActive: true,
  });
  // 섹션별 상세 입력 필드
  const [textContent, setTextContent] = useState("");
  const [introData, setIntroData] = useState({ subtitle: "", contact: "" });
  const [programData, setProgramData] = useState({ age: "", description: "", color: "blue" });
  const [activityItems, setActivityItems] = useState<string[]>([""]);
  const [stepData, setStepData] = useState({ step: "", description: "" });
  const [statisticData, setStatisticData] = useState({ number: "", description: "" });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch("/api/admin/family360");
      if (response.ok) {
        const data = await response.json();
        setContents(data);
      }
    } catch (error) {
      console.error("콘텐츠 로딩 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 섹션별로 content를 자동 생성
    let content = "";
    
    if (activeSection === "intro") {
      // 안내 데이터 → JSON 객체로 변환
      content = JSON.stringify(introData);
    } else if (activeSection === "intro_feature") {
      // 일반 텍스트 → JSON 배열로 변환
      content = JSON.stringify([textContent]);
    } else if (activeSection === "program") {
      // 프로그램 데이터 → JSON 객체로 변환
      content = JSON.stringify(programData);
    } else if (activeSection === "activity") {
      // 활동 리스트 → JSON 배열로 변환
      content = JSON.stringify(activityItems.filter(item => item.trim() !== ""));
    } else if (activeSection === "step") {
      // 단계 데이터 → JSON 객체로 변환
      content = JSON.stringify(stepData);
    } else if (activeSection === "statistic") {
      // 통계 데이터 → JSON 객체로 변환
      content = JSON.stringify(statisticData);
    }

    // 섹션에 따라 자동으로 키 생성
    let finalKey = "";
    if (editingId) {
      // 수정하는 경우 기존 키 유지
      const existingContent = contents.find(c => c.id === editingId);
      finalKey = existingContent?.key || "";
    } else {
      // 새로 추가하는 경우 자동으로 키 생성
      const sectionContents = filteredContents;
      const maxNum = sectionContents.length > 0 
        ? Math.max(...sectionContents.map(c => {
            const match = c.key.match(/_(\d+)$/);
            return match ? parseInt(match[1]) : 0;
          }))
        : 0;
      finalKey = `${activeSection}_${maxNum + 1}`;
    }

    try {
      const url = editingId
        ? `/api/admin/family360/${editingId}`
        : "/api/admin/family360";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          key: finalKey,
          content: content
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: editingId ? "수정되었습니다!" : "추가되었습니다!",
        });
        resetForm();
        setShowModal(false);
        fetchContents();
        setTimeout(() => setMessage({ type: "", text: "" }), 2000);
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.error || "오류가 발생했습니다.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "서버 오류가 발생했습니다." });
    }
  };

  const handleEdit = (content: Family360Content) => {
    setEditingId(content.id);
    setFormData({
      title: content.title,
      content: content.content,
      icon: content.icon || "",
      order: content.order,
      isActive: content.isActive,
    });

    // 섹션별로 content를 파싱하여 폼 필드에 설정
    try {
      const parsed = JSON.parse(content.content);
      
      if (content.key.startsWith("intro") && !content.key.startsWith("intro_feature")) {
        setIntroData(parsed);
      } else if (content.key.startsWith("intro_feature")) {
        setTextContent(Array.isArray(parsed) ? parsed[0] || "" : "");
      } else if (content.key.startsWith("program")) {
        setProgramData(parsed);
      } else if (content.key.startsWith("activity")) {
        setActivityItems(Array.isArray(parsed) ? parsed : [""]);
      } else if (content.key.startsWith("step")) {
        setStepData(parsed);
      } else if (content.key.startsWith("statistic")) {
        setStatisticData(parsed);
      }
    } catch (e) {
      console.error("데이터 파싱 오류:", e);
      setTextContent(content.content);
    }

    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`/api/admin/family360/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMessage({ type: "success", text: "삭제되었습니다!" });
        fetchContents();
        setTimeout(() => setMessage({ type: "", text: "" }), 2000);
      }
    } catch (error) {
      setMessage({ type: "error", text: "삭제 중 오류가 발생했습니다." });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      icon: "",
      order: 0,
      isActive: true,
    });
    setTextContent("");
    setIntroData({ subtitle: "", contact: "" });
    setProgramData({ age: "", description: "", color: "blue" });
    setActivityItems([""]);
    setStepData({ step: "", description: "" });
    setStatisticData({ number: "", description: "" });
    setShowModal(false);
  };

  // 현재 섹션에 해당하는 콘텐츠만 필터링
  const filteredContents = contents.filter(content => {
    // intro 섹션은 정확히 'intro_숫자' 패턴만 매칭
    if (activeSection === "intro") {
      return content.key.match(/^intro_\d+$/);
    }
    // intro_feature 섹션은 정확히 'intro_feature_숫자' 패턴만 매칭
    if (activeSection === "intro_feature") {
      return content.key.match(/^intro_feature_\d+$/);
    }
    // 나머지 섹션은 prefix로 시작하는 것들
    return content.key.startsWith(activeSection);
  }).sort((a, b) => a.order - b.order);

  // 섹션 이름 가져오기
  const getCurrentSection = () => {
    return sections.find(s => s.id === activeSection);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-500"></i>
      </div>
    );
  }

  const currentSection = getCurrentSection();

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">가정교회 360 관리</h1>
        <p className="text-gray-600 mt-2">
          가정교회 360 페이지의 콘텐츠를 섹션별로 관리합니다.
        </p>
      </div>

      {/* 메시지 */}
      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 섹션 탭 */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {sections.map((section) => {
              const sectionCount = contents.filter(c => 
                c.key.startsWith(section.id)
              ).length;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-shrink-0 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeSection === section.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <i className={`fa-solid fa-${section.icon}`}></i>
                    <span>{section.name}</span>
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                      {sectionCount}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* 섹션 내용 */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {currentSection?.name}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {currentSection?.description}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <i className="fa-solid fa-plus"></i>
              <span>추가</span>
            </button>
          </div>

          {/* 콘텐츠 목록 */}
          {filteredContents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fa-solid fa-inbox text-4xl mb-4"></i>
              <p>등록된 콘텐츠가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContents.map((content) => (
                <div
                  key={content.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {content.icon && (
                          <i className={`fa-solid fa-${content.icon} text-blue-600 text-lg`}></i>
                        )}
                        <h3 className="text-lg font-semibold text-gray-800">
                          {content.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            content.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {content.isActive ? "활성" : "비활성"}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <div className="bg-gray-50 p-3 rounded font-mono text-xs overflow-x-auto">
                          {content.content}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        순서: {content.order} | 수정일: {new Date(content.updatedAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(content)}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      >
                        <i className="fa-solid fa-edit"></i> 수정
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                      >
                        <i className="fa-solid fa-trash"></i> 삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editingId ? `${currentSection?.name} 수정` : `${currentSection?.name} 추가`}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="fa-solid fa-times text-2xl"></i>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 가정 중심, 영유아부, 가정 예배 등"
                    required
                  />
                </div>

                {/* 섹션별 입력 필드 */}
                {activeSection === "intro" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        안내 설명 *
                      </label>
                      <textarea
                        value={introData.subtitle}
                        onChange={(e) => setIntroData({...introData, subtitle: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 여러분의 가정이 하나님의 사랑으로 가득한 작은 교회가 되도록 함께하세요."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        문의 정보 *
                      </label>
                      <input
                        type="text"
                        value={introData.contact}
                        onChange={(e) => setIntroData({...introData, contact: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 문의: 교회 사무실 | 이메일: family360@dongseoro.or.kr"
                        required
                      />
                    </div>
                  </div>
                )}

                {activeSection === "intro_feature" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      내용 *
                    </label>
                    <textarea
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="내용을 입력하세요. HTML 태그 사용 가능합니다."
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      일반 텍스트 또는 HTML로 작성할 수 있습니다.
                    </p>
                  </div>
                )}

                {activeSection === "program" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        대상 연령 *
                      </label>
                      <input
                        type="text"
                        value={programData.age}
                        onChange={(e) => setProgramData({...programData, age: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 0-5세, 6-12세"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        프로그램 설명 *
                      </label>
                      <textarea
                        value={programData.description}
                        onChange={(e) => setProgramData({...programData, description: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="프로그램 설명을 입력하세요"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        색상 *
                      </label>
                      <select
                        value={programData.color}
                        onChange={(e) => setProgramData({...programData, color: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="red">빨강</option>
                        <option value="yellow">노랑</option>
                        <option value="green">초록</option>
                        <option value="blue">파랑</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeSection === "activity" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      활동 목록 *
                    </label>
                    {activityItems.map((item, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const newItems = [...activityItems];
                            newItems[index] = e.target.value;
                            setActivityItems(newItems);
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder={`활동 ${index + 1}`}
                          required
                        />
                        {activityItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setActivityItems(activityItems.filter((_, i) => i !== index))}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setActivityItems([...activityItems, ""])}
                      className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      항목 추가
                    </button>
                  </div>
                )}

                {activeSection === "step" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        단계 *
                      </label>
                      <input
                        type="text"
                        value={stepData.step}
                        onChange={(e) => setStepData({...stepData, step: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 1단계, 첫째, Step 1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        설명 *
                      </label>
                      <textarea
                        value={stepData.description}
                        onChange={(e) => setStepData({...stepData, description: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="단계 설명을 입력하세요"
                        required
                      />
                    </div>
                  </div>
                )}

                {activeSection === "statistic" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        수치/통계 *
                      </label>
                      <input
                        type="text"
                        value={statisticData.number}
                        onChange={(e) => setStatisticData({...statisticData, number: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="예: 95%, 150+, 3년"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        설명
                      </label>
                      <input
                        type="text"
                        value={statisticData.description}
                        onChange={(e) => setStatisticData({...statisticData, description: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="통계 설명 (선택사항)"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      아이콘 (FontAwesome)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="예: home, users, heart"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      FontAwesome 아이콘 이름
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      순서 *
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          order: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    활성화 (체크 해제 시 페이지에 표시되지 않음)
                  </label>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {editingId ? "수정" : "추가"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
