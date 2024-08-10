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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        新規登録（ワンちゃん飼っていない人）
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">名前</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">メールアドレス</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">パスワード</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-white"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">自己紹介</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded text-white"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            プロフィール画像 (ファイルを選択)
          </label>
          <input
            type="file"
            onChange={handleFileChange} // 画像アップロード処理を追加
            className="w-full border border-gray-300 p-2 rounded text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          登録
        </button>
      </form>
    </div>
  );
}
