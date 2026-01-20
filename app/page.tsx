"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

interface SiteContent {
  title: string;
  content: string;
  imageUrl: string | null;
}

interface MainSlide {
  id: number;
  imageUrl: string;
  title: string | null;
  description: string | null;
  order: number;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [siteContent, setSiteContent] = useState<Record<string, SiteContent>>({});
  const [slides, setSlides] = useState<MainSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteContent();
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5초마다 전환

    return () => clearInterval(timer);
  }, [slides.length]);

  const fetchSiteContent = async () => {
    try {
      const response = await fetch('/api/site-content');
      if (response.ok) {
        const data = await response.json();
        setSiteContent(data);
      }
    } catch (error) {
      console.error('콘텐츠 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slides');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('슬라이드 로딩 오류:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // 슬라이드가 없으면 로딩 표시
  if (slides.length === 0) {
    return <div className="text-center py-12">로딩 중...</div>;
  }

  return (
    <div className="space-y-5">
      {/* 환영 메시지 */}
      {(siteContent.welcome_title?.content || siteContent.welcome_message?.content) && (
        <section className="text-center py-12">
          {siteContent.welcome_title?.content && (
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              {siteContent.welcome_title.content}
            </h2>
          )}
          {siteContent.welcome_message?.content && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {siteContent.welcome_message.content}
            </p>
          )}
        </section>
      )}

      {/* 메인 슬라이드 */}
      <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title || `슬라이드 ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}

        {/* 이전/다음 버튼 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition z-10"
        >
          <i className="fa-solid fa-chevron-left text-gray-800 text-xl"></i>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-3 transition z-10"
        >
          <i className="fa-solid fa-chevron-right text-gray-800 text-xl"></i>
        </button>

        {/* 인디케이터 */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 예배 안내 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">예배 안내</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 주일 예배 */}
          {siteContent.worship_sunday?.content && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4 text-[#c69d6c]">
                {siteContent.worship_sunday.title || '주일 예배'}
              </h4>
              <div className="text-gray-600 whitespace-pre-wrap">
                {siteContent.worship_sunday.content}
              </div>
            </div>
          )}
          
          {/* 수요 예배 */}
          {siteContent.worship_wednesday?.content && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4 text-[#c69d6c]">
                {siteContent.worship_wednesday.title || '수요 예배'}
              </h4>
              <div className="text-gray-600 whitespace-pre-wrap">
                {siteContent.worship_wednesday.content}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 교회 소개 */}
      <section className="py-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">교회 소개</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {/* 사랑의 교회 */}
          {siteContent.intro_love?.content && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-heart text-white text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2">
                {siteContent.intro_love.title || '사랑'}
              </h4>
              <p className="text-gray-600">{siteContent.intro_love.content}</p>
            </div>
          )}
          
          {/* 말씀의 교회 */}
          {siteContent.intro_word?.content && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-book text-white text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2">
                {siteContent.intro_word.title || '말씀'}
              </h4>
              <p className="text-gray-600">{siteContent.intro_word.content}</p>
            </div>
          )}
          
          {/* 섬김의 교회 */}
          {siteContent.intro_service?.content && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-hands text-white text-2xl"></i>
              </div>
              <h4 className="text-lg font-semibold mb-2">
                {siteContent.intro_service.title || '섬김'}
              </h4>
              <p className="text-gray-600">{siteContent.intro_service.content}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
