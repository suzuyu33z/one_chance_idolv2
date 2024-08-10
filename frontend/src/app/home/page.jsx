"use client";
import React, { useState, useEffect } from "react";
import WalkInfoCard from "../components/walk_info_card";
import useAuth from "../utils/useAuth"; // カスタムフックをインポート

export default function UserWalkListPage() {
  const isAuthenticated = useAuth(); // 認証状態を取得
  const [walks, setWalks] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false); // ページロード状態

  useEffect(() => {
    if (isAuthenticated) {
      // ログインしている場合のみデータを取得
      fetch(`${process.env.API_ENDPOINT}/api/all_user_walks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // セッションを含める
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Fetched walks data:", data); // 取得したデータを表示
          setWalks(data);
        })
        .catch((error) => console.error("Error fetching user walks:", error));
    }
    setIsPageLoaded(true); // ページがロードされたことをマーク
  }, [isAuthenticated]);

  useEffect(() => {
    if (isPageLoaded) {
      // ページロード後にフッターを表示
      const layoutFooter = document.querySelector("footer");
      if (layoutFooter) {
        layoutFooter.style.display = "flex"; // フッターを再表示
      }
    }
  }, [isPageLoaded]); // ページロード後にフッターを再表示

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ヘッダー */}
      <header className="w-full bg-green-100 py-4 text-center text-green-700 font-bold text-lg">
        わん-Chance-アイドル
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto w-full">
        <div className="flex flex-col items-center px-4 pt-4 pb-8">
          {/* タイトル */}
          <h2 className="text-lg font-bold mb-4">わんちゃんに会う予定</h2>

          {/* WalkInfoCardを表示 */}
          {walks.length > 0 ? (
            walks.map((walk, index) => (
              <WalkInfoCard
                key={index}
                date={walk.date}
                time={`${walk.time_start}〜${walk.time_end}`} // 時間を表示
                location={walk.location}
                dogs={walk.dogs}
                walkId={walk.walk_id}
              />
            ))
          ) : (
            <p className="text-gray-500">該当する結果が見つかりません。</p>
          )}
        </div>
      </main>
    </div>
  );
}
