"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VisitorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: "",
    bio: "",
    dog_number: 0,
    points: 0,
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadData, // ファイルを直接APIに送信
      });

      const result = await response.json();
      if (response.ok) {
        setFormData({ ...formData, image: result.url }); // 返された画像URLをフォームデータに設定
      } else {
        console.error("画像のアップロードに失敗しました", result.error);
      }
    } catch (error) {
      console.error("画像のアップロード中にエラーが発生しました", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(process.env.API_ENDPOINT + `/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // 登録成功時、ホームページへリダイレクト
      router.push("/");
    } else {
      // エラーハンドリング
      console.error("Registration failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#75A05A]">
        新規登録
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">名前</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="例: 山田 太郎"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">メールアドレス</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="例: example@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">パスワード</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="6文字以上のパスワード"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">自己紹介</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
            placeholder="自己紹介を記入してください"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            プロフィール画像 (ファイルを選択)
          </label>
          <input
            type="file"
            onChange={handleFileChange} // 画像アップロード処理を追加
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A8D38D] placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#A8D38D] text-white p-3 rounded-lg font-semibold hover:bg-[#96c781] transition-colors"
        >
          登録
        </button>
      </form>
    </div>
  );
}

