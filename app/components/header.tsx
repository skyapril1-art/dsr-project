"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    const [side_menu, setside_menu] = useState('translate-x-full');
    const [shadow, setshadow] = useState('w-0');
    const [xmark, setXmark] = useState('hidden');
    const [side_menu_hidden, setside_menu_hidden] = useState('hidden');
    const [chevron_mark, setchevron_mark] = useState('fa-solid fa-chevron-down');
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const response = await fetch('/api/auth/session');
            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data.user);
                setIsAdmin(data.isAdmin);
            } else {
                // 세션이 유효하지 않으면 상태 초기화
                setCurrentUser(null);
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('사용자 상태 확인 오류:', error);
            // 오류 발생 시에도 상태 초기화
            setCurrentUser(null);
            setIsAdmin(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/session', {
                method: 'DELETE',
            });
            
            if (response.ok) {
                setCurrentUser(null);
                setIsAdmin(false);
                window.location.href = '/';
            }
        } catch (error) {
            console.error('로그아웃 오류:', error);
        }
    };
    function side_toggle() {
        if (side_menu === 'translate-x-full') {
            setside_menu('translate-x-0')
            setshadow('w-full')
            setXmark('block')
        } else {
            setside_menu('translate-x-full')
            setshadow('w-0')
            setXmark('hidden')
        }
    }
    function hidden_toggle() {
        if (side_menu_hidden === 'hidden') {
            setside_menu_hidden('flex')
            setchevron_mark('fa-solid fa-chevron-up')

        } else {
            setside_menu_hidden('hidden')
            setchevron_mark('fa-solid fa-chevron-down')
        }
    }


    return (
        <>
            <div className="bg-[#c69d6c] lg:bg-[rgba(198,157,108,0.7)] w-full">
                <div className="flex justify-end max-w-[1280px] mx-auto">
                    {currentUser ? (
                        <>
                            <div className="py-1">
                                <span className="text-white text-center px-4">
                                    {currentUser.name}님
                                </span>
                            </div>
                            {isAdmin && (
                                <div className="py-1">
                                    <Link href="/admin" className="text-white text-center px-4">
                                        관리자<i className="fa-solid fa-cog ml-1"></i>
                                    </Link>
                                </div>
                            )}
                            <div className="py-1">
                                <button 
                                    onClick={handleLogout}
                                    className="text-white text-center px-4"
                                >
                                    로그아웃<i className="fa-solid fa-right-from-bracket ml-1"></i>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="py-1">
                                <Link href="/login" className="text-white text-center px-4">
                                    로그인<i className="fa-solid fa-right-to-bracket ml-1"></i>
                                </Link>
                            </div>
                            <div className="py-1">
                                <Link href="/signup" className="text-white text-center px-4" >
                                    회원가입<i className="fa-solid fa-user-group ml-1"></i>
                                </Link>
                            </div>
                        </>
                    )}
                    <div className="py-1">
                        <a className="text-white text-center px-4" href="https://www.youtube.com/@%EC%9D%B5%EC%82%B0%EB%8F%99%EC%84%9C%EB%A1%9C%EA%B5%90%ED%9A%8C" target="_blank" rel="noopener noreferrer">
                            <i className="fa-brands fa-youtube"></i>
                        </a>
                    </div>
                </div>
            </div>
            {/*네비 메뉴*/}
            <div className='w-full border-b border-gray-300'>
                <div className="flex justify-between py-2 max-w-[1280px] mx-auto relative ">
                    <Link href="/" className="flex items-center">
                        <Image 
                            src="/images/logo/동서로교회_로고1.png" 
                            alt="동서로교회 로고" 
                            width={512} 
                            height={320}
                            className="h-20 w-auto object-contain"
                            priority
                            quality={100}
                            unoptimized
                        />
                    </Link>
                    <div className="hidden lg:flex font-bold text-lg space-x-15 justify-center pl-[5%] items-center">
                        <div className='group'>
                            <Link href="/about">교회소개</Link>
                            <div className='absolute top-full bg-[#212121] w-[150px] invisible group-hover:visible transition-all duration-500 opacity-0 group-hover:opacity-100 z-50'>
                                <Link href="/about" className="block text-white p-2 hover:bg-gray-700">교회 소개</Link>
                                <Link href="/about#history" className="block text-white p-2 hover:bg-gray-700">연혁</Link>
                                <Link href="/about#worship" className="block text-white p-2 hover:bg-gray-700">예배안내</Link>
                            </div>
                        </div>

                        <Link href="/ministry">사역팀</Link>
                        <Link href="/events">행사</Link>
                        <Link href="/community">목장</Link>
                        <Link href="/community/board">커뮤니티</Link>
                        <Link href="/family360">가정교회360</Link>
                    </div>
                    {/*모바일메뉴버튼 */}
                    <button onClick={side_toggle} className="flex lg:hidden mr-[10%] px-[5%] items-center text-4xl text-[#c69d6c]">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                </div>
            </div>
            <div className='flex '>

            </div>
            {/*모바일 메뉴 클릭*/}
            <div className={`fixed top-0 ${shadow} h-full z-50`}>
                <div onClick={side_toggle} className="bg-black w-[100%] h-[100%] opacity-60"></div>
                <div className={`fixed right-0 top-0 z-[60] h-full w-[300px] bg-white transition-transform duration-300 will-change-transform ${side_menu}`}>
                    <div className="flex flex-col h-full items-left py-4 divide-y divide-gray-300">
                        <button onClick={hidden_toggle} className="flex justify-between px-4 h-[30px] text-l my-2 items-center">
                            <div>교회소개</div>
                            <div>
                                <i className={`${chevron_mark}`}></i>
                            </div>
                        </button>
                        <div className={`${side_menu_hidden} flex-col w-[100%] h-auto divide-y divide-gray-300 transition-all`} >
                            <Link href="/about" onClick={side_toggle} className="flex h-auto pl-9 py-1">교회 소개</Link>
                            <Link href="/about#history" onClick={side_toggle} className="flex h-auto pl-9 py-1">연혁</Link>
                            <Link href="/about#worship" onClick={side_toggle} className="flex h-auto pl-9 py-1">예배안내</Link>
                        </div>
                        <Link href="/ministry" onClick={side_toggle} className="flex justify-between px-4 h-[40px] text-l py-2 items-center">
                            사역팀
                        </Link>
                        <Link href="/events" onClick={side_toggle} className="flex justify-between px-4 h-[40px] text-l py-2 items-center">
                            행사
                        </Link>
                        <Link href="/community" onClick={side_toggle} className="flex justify-between px-4 h-[40px] text-l py-2 items-center">
                            목장
                        </Link>
                        <Link href="/community/board" onClick={side_toggle} className="flex justify-between px-4 h-[40px] text-l py-2 items-center">
                            커뮤니티
                        </Link>
                        <Link href="/family360" onClick={side_toggle} className="flex justify-between px-4 h-[40px] text-l py-2 items-center">
                            가정교회360
                        </Link>
                    </div>
                </div>
                <button onClick={side_toggle} className={`fixed top-4 right-[310px] text-2xl text-white transition-all z-[60] ${xmark}`}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
        </>
    );
}