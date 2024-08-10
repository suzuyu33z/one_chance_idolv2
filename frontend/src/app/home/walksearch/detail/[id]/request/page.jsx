"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "../../../../../utils/useAuth"; // useAuthをインポート

export default function WalkSearchDetailRequest() {
  const { id } = useParams(); // walk_id を取得
  const router = useRouter();
  const isAuthenticated = useAuth(); // 認証状態を確認
  const [walkDetail, setWalkDetail] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (isAuthenticated && id) {
      // ユーザー情報を取得
      fetch(`${process.env.API_ENDPOINT}/api/check-auth`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.user_id) {
            setUserId(data.user_id); // ユーザーIDを保存
          }
        })
        .catch((error) => console.error("Error fetching user info:", error));

      // Flask APIから特定のwalk_idのデータを取得
      fetch(`${process.env.API_ENDPOINT}/api/walks/${id}`)
        .then((response) => response.json())
        .then((data) => setWalkDetail(data))
        .catch((error) => console.error("Error fetching walk detail:", error));
    }
  }, [isAuthenticated, id]);

  const handleRequest = () => {
    if (!walkDetail || !userId) return;

    const requestData = {
      walk_id: id,
      requested_time: walkDetail.time_start,
    };

    fetch(`${process.env.API_ENDPOINT}/api/request_walk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          alert("申請が成功しました！");
          router.push("/home/walksearch"); // 申請後、元のページにリダイレクト
        } else {
          alert("申請に失敗しました。再度お試しください。");
        }
      })
      .catch((error) => {
        console.error("Error requesting walk:", error);
        alert("申請に失敗しました。再度お試しください。");
      });
  };

  if (!walkDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full bg-green-100 py-4 text-center text-green-700 font-bold text-lg">
        わん-Chance-アイドル
      </header>

      <main className="flex-1 overflow-y-auto w-full px-4 py-4">
        <h2 className="text-xl font-bold text-center mb-6">申請しますか？</h2>
        <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">日時</h3>
          <p>
            {walkDetail.date} {walkDetail.time_start}〜{walkDetail.time_end}
          </p>

          <h3 className="text-lg font-semibold mb-2 mt-4">場所</h3>
          <p>{walkDetail.location}</p>

          <h3 className="text-lg font-semibold mb-2 mt-4">わんちゃん</h3>
          {walkDetail.dogs.map((dog, index) => (
            <p key={index}>
              {dog.name} / {dog.breed} / {dog.age}歳 / {dog.gender}
            </p>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded"
            onClick={handleRequest}
          >
            申請する
          </button>
        </div>
      </main>
    </div>
  );
}
