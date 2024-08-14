"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import '../globals.css'; // グローバルCSSをインポート

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 10; // スクロールのしきい値を設定

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;

      if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
        if (currentScrollY > lastScrollY) {
          // 下にスクロール
          setIsVisible(false);
        } else {
          // 上にスクロール
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [lastScrollY]);

  return (
    <header className={`bg-white py-0 px-2 border-b-2 border-[#c5e1a5] text-center fixed top-0 w-full z-[1000] flex justify-between items-center duration-100 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <svg width="220" height="40" viewBox="0 10 220 40">
        <defs>
          <path id="curve" d="M 10,40 Q 100,20 190,40" />
        </defs>
        <text width="220" style={{ fontFamily: 'Kosugi Maru, sans-serif', fill: '#75A05A', fontSize: '14px', fontWeight: 'bold', letterSpacing: '-0.5px', textDecoration: 'underline' }}>  
          <textPath xlinkHref="#curve" dy={-5}>
            わん^Chance^アイドル
          </textPath>
        </text>
      </svg>
      <Link href="/logout" className="text-[#75A05A] font-semibold py-1 px-2 rounded border border-[#75A05A] hover:bg-[#A8D38D] hover:text-white text-xs">
        ログアウト
      </Link>
    </header>
  );
}





