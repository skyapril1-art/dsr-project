"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // 갤러리 이미지 목록
  const slides = [
    "/images/gallery/메인사진.jpg",
    "/images/gallery/005b55574b89de19fcec80c7e32d8c15.jpg",
    "/images/gallery/75def23abc7bbd4a9d64adf360eeb145.jpg",
    "/images/gallery/ed9ad5fee6294997f6fb4dc3122feec7.jpg",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5초마다 전환

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="space-y-12">
      {/* 메인 슬라이드 */}
      <div className="relative h-[500px] overflow-hidden rounded-lg shadow-lg">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide}
              alt={`교회 슬라이드 ${index + 1}`}
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

      {/* 환영 메시지 */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">동서로교회에 오신 것을 환영합니다</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          우리는 하나님의 말씀을 중심으로 한 신앙 공동체입니다. 
          모든 사람이 하나님의 사랑을 경험하고 성장할 수 있는 곳입니다.
          함께 예배하고, 교제하며, 섬기는 기쁨을 나누어요.
        </p>
      </section>

      {/* 예배 안내 */}
      <section className="bg-gray-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">예배 안내</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4 text-[#c69d6c]">주일 예배</h4>
            <div className="space-y-2 text-gray-600">
              <p><strong>1부:</strong> 오전 8:00</p>
              <p><strong>2부:</strong> 오전 10:30</p>
              <p><strong>3부:</strong> 오후 2:00</p>
              <p><strong>장소:</strong> 본당</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4 text-[#c69d6c]">수요 예배</h4>
            <div className="space-y-2 text-gray-600">
              <p><strong>시간:</strong> 오후 7:30</p>
              <p><strong>장소:</strong> 본당</p>
              <p><strong>내용:</strong> 말씀과 기도</p>
            </div>
          </div>
        </div>
      </section>

      {/* 교회 소개 */}
      <section className="py-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">교회 소개</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-heart text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">사랑</h4>
            <p className="text-gray-600">하나님의 사랑을 경험하고 나누는 공동체</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-book text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">말씀</h4>
            <p className="text-gray-600">성경 말씀을 중심으로 한 신앙 생활</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#c69d6c] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa-solid fa-hands text-white text-2xl"></i>
            </div>
            <h4 className="text-lg font-semibold mb-2">섬김</h4>
            <p className="text-gray-600">서로 섬기고 지역사회를 사랑하는 교회</p>
          </div>
        </div>
      </section>

      {/* 연락처 */}
      <section className="bg-[#c69d6c] text-white p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-center mb-6">오시는 길</h3>
        <div className="text-center space-y-2">
          <p className="text-lg"><i className="fa-solid fa-location-dot mr-2"></i>전라북도 익산시 동서로 179-49</p>
          <p className="text-lg"><i className="fa-solid fa-phone mr-2"></i>문의: 교회 사무실</p>
          <p className="text-lg"><i className="fa-brands fa-youtube mr-2"></i>온라인 예배도 함께하세요</p>
        </div>
      </section>
    </div>
  );
}
