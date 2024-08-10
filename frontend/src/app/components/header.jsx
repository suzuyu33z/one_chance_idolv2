"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import '../globals.css'; // グローバルCSSをインポート

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY) {
        // 下にスクロール
        setIsVisible(false);
      } else {
        // 上にスクロール
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
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
    <header className={`bg-white py-2 px-4 border-b-2 border-[#c5e1a5] text-center fixed top-0 w-full z-1000 flex justify-between items-center duration-100 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <h1 className="text-lg font-bold text-[#A8D38D] whitespace-nowrap">わん・Chance・アイドル</h1>
      <Link href="/logout" className="text-[#A8D38D] font-semibold py-1 px-2 rounded border border-[#A8D38D] hover:bg-[#A8D38D] hover:text-white text-xs">
        ログアウト
      </Link>
    </header>
  );
}

