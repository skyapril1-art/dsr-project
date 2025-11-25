import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/public/fontawesome-free-6.7.2-web/css/all.css"
import Header from "./components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  

  return (
    <html lang="en" className="overflow-scroll">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header></Header>
        {/*페이지 레이아웃*/}
        <div className="h-[auto] max-w-[1280px] px-[10%] mx-auto">
        {children}
        </div>
        {/*풋터 교회정보 */}
        <div className="bg-[#363636] h-auto">
          <div className="flex justify-center px-10 py-5 text-white space-x-3 text-xs">
            <a href="/">교회소개</a>
            <a href="/">사역팀</a>
            <a href="/">행사</a>
            <a href="/">목장</a>
            <a href="/">커뮤니티</a>
            <a href="/">가정교회360</a>
          </div>
          <div className="flex flex-col justify-center items-center text-white text-xs h-20 space-y-2">
            <span>동서로교회</span>
            <span>전라북도 익산시 동서로 179-49</span>
          </div>
          <div className="flex justify-center text-white text-xs h-10 space-x-3 items-center">
            <a href="/">이용약관</a>
            <a href="/">개인정보처리방침</a>
          </div>
          <div className="flex justify-center text-white text-xs h-10">
            Copyright ⓒ 2025 동서로교회 All rights reserved.
          </div>
        </div>
      </body>
    </html>
  );
}
