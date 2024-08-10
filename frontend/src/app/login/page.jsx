"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // APIエンドポイントにPOSTリクエストを送信
    const response = await fetch(process.env.API_ENDPOINT + `/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // フォームデータをJSONに変換して送信
      credentials: "include", // <-- これが重要
    });

    if (response.ok) {
      const data = await response.json();
      // ログイン成功時、必要に応じてセッションやトークンを保存
      // 例えば、localStorageに保存するなど
      // localStorage.setItem('token', data.token); // JWTトークンを使用する場合

      // ホームページへリダイレクト
      router.push("/home");
    } else {
      console.error("Login failed.");
      // ログイン失敗時のエラーハンドリング
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          ログイン
        </button>
      </form>
    </div>
  );
}
