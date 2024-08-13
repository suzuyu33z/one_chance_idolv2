"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useAuth from "../../../../utils/useAuth";

export default function WalkDetailPage() {
  const isAuthenticated = useAuth(); // 認証状態を確認
  const { id } = useParams(); // useParamsでidを取得
  const router = useRouter(); // useRouterを初期化

  const [walkDetail, setWalkDetail] = useState(null);
  const [messages, setMessages] = useState([]); // メッセージを格納するための状態を追加
  const [newMessage, setNewMessage] = useState(""); // 新しいメッセージの状態を追加
  const [userId, setUserId] = useState(null); // ログインしているユーザーIDを保存

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

      // Flask APIから特定のwalk_idのメッセージを取得
      fetch(`${process.env.API_ENDPOINT}/api/walks/${id}/messages`)
        .then((response) => response.json())
        .then((data) => setMessages(data))
        .catch((error) => console.error("Error fetching messages:", error));
    }
  }, [isAuthenticated, id]);

  // コメント送信ハンドラー
  const handleSendMessage = () => {
    if (newMessage.trim() && userId) {
      // ユーザーIDが取得できている場合のみ送信
      const messageData = {
        walk_id: id,
        message: newMessage,
        sender_user_id: userId, // 取得したユーザーIDを使用
      };

      fetch(`${process.env.API_ENDPOINT}/api/walks/${id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages([...messages, data]); // 新しいメッセージを追加
          setNewMessage(""); // 入力フィールドをクリア
        })
        .catch((error) => console.error("Error sending message:", error));
    }
  };

  // "申請する"ボタンがクリックされたときのハンドラー
  const handleRequest = () => {
    router.push(`/home/walksearch/detail/${id}/request`); // 指定されたパスに遷移
  };

  if (!walkDetail) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 mt-4"> {/* 上部にマージンを追加 */}
      <main className="flex-1 w-full px-6 py-8 mb-24">
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            {/* わんちゃん、日時、散歩についてを1つのBoxにまとめる */}
            <div className="space-y-4">
              {walkDetail.dogs.map((dog, index) => (
                <div key={index} className="flex items-start">
                  <img
                    src={dog.image} // ここでCloudinaryのURLを直接使用
                    alt={dog.name}
                    className="w-24 h-24 object-cover rounded-lg shadow-md mr-4"
                  />
                  <div>
                    <p className="text-md font-semibold text-gray-800">
                      {dog.name} / {dog.breed} / {dog.age}歳 / {dog.gender}
                    </p>
                    <p className="text-md text-gray-600 mt-1">{dog.description}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">日時</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {walkDetail.date} {walkDetail.time_start}〜{walkDetail.time_end}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">場所</p>
                  <p className="text-lg font-semibold text-gray-800">{walkDetail.location}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm">散歩について</p>
                <p className="text-lg text-gray-800 mt-1">{walkDetail.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md mt-6">
            <p className="text-gray-500 text-sm">オーナー情報</p>
            <p className="text-lg font-semibold text-gray-800 mt-1">名前: {walkDetail.owner_name}</p>
            <p className="text-md text-gray-800 mt-1">自己紹介: {walkDetail.owner_bio}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">コメント</h2>
          <div className="bg-gray-100 text-gray-800 p-4 rounded-lg mb-6 shadow-inner">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div key={index} className="mb-4">
                  <p className="text-sm font-semibold text-gray-700">{message.sender_name}</p>
                  <p className="text-sm text-gray-600">{message.message}</p>
                  <p className="text-xs text-gray-500">{message.timestamp}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600">コメントがありません。</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="ここにコメントを入力..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)} // 入力内容をnewMessageに設定
          />
          <button
            className="bg-[#A8D38D] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#96c781] transition-colors shadow-md"
            onClick={handleSendMessage} // クリックでコメント送信ハンドラーを呼び出す
          >
            送信
          </button>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-[#5A8D75] text-white py-2 px-6 rounded-lg font-semibold hover:bg-[#487760] transition-colors shadow-md"
            onClick={handleRequest} // "申請する"ボタンをクリックしたときに呼ばれる
          >
            申請する
          </button>
        </div>
      </main>
    </div>
  );
}
