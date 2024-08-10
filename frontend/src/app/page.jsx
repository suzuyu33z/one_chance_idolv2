import Link from "next/link";
import "./globals.css";

export default function Top() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ヘッダー部分 */}
      <header className="w-full bg-green-100 py-4 text-center text-green-700 font-bold text-lg">
        わん-Chance-アイドル
      </header>

      {/* コンテンツ部分 */}
      <main className="p-4 flex flex-col items-center flex-1">
        <h1 className="text-2xl font-bold mb-4">
          ログイン／新規登録をしてください
        </h1>
        <div className="flex flex-col items-center w-full">
          <Link
            href="/login"
            className="button-link w-2/3 max-w-xs inline-block mt-4 text-center" // 幅を広げる
          >
            ログイン
          </Link>
          <Link
            href="/new"
            className="button-link w-2/3 max-w-xs inline-block mt-4 text-center" // 幅を広げる
          >
            新規登録
          </Link>
        </div>
      </main>
    </div>
  );
}
