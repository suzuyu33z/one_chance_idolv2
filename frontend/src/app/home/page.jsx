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

          // 日付と開始時間でソート
          const sortedWalks = data.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time_start}`);
            const dateB = new Date(`${b.date}T${b.time_start}`);
            return dateB - dateA; // 新しい順にソート
          });

          setWalks(sortedWalks);
        })
        .catch((error) => console.error("Error fetching user walks:", error));
    }
    setIsPageLoaded(true); // ページがロードされたことをマーク
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー */}

      {/* メインコンテンツ */}
      <main className="flex-1 overflow-y-auto w-full mt-16">
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
                pointsRequired={walk.points_required} // ここに必要ポイントを追加
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
