import Link from "next/link";
import "./globals.css";

export default function Top() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-100">
      {/* ヘッダー部分 */}
      <header className={`bg-white py-0 px-2 border-b-2 border-[#c5e1a5] text-center fixed top-0 w-full z-[1000] flex justify-between items-center duration-100`}>
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
      </header>

      {/* コンテンツ部分 */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 pt-16">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          わんちゃんと、特別な体験を。
        </h1>
        <div className="flex flex-col items-center w-full space-y-6">
          <Link
            href="/login"
            className="w-2/3 max-w-xs py-4 text-center rounded-full text-white bg-[#A8D38D] hover:bg-[#96c781] transition-colors shadow-lg transform hover:scale-105"
          >
            今すぐ参加
          </Link>
          <Link
            href="/new"
            className="w-2/3 max-w-xs py-4 text-center rounded-full text-[#A8D38D] bg-white border border-[#A8D38D] hover:bg-gray-50 transition-colors shadow-lg transform hover:scale-105"
          >
            新規登録はこちら
          </Link>
        </div>
      </main>

      {/* フッター部分 */}
      <footer className="w-full py-6 bg-gray-200 text-center text-gray-500 text-sm shadow-inner">
        &copy; 2024 わん-Chance-アイドル. All rights reserved.
      </footer>
    </div>
  );
}


