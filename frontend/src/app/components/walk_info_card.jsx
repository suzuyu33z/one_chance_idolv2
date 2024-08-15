import React from "react";
import Link from "next/link";

export default function WalkInfoCard({
  date,
  time,
  location,
  dogs,
  walkId,
  pointsRequired,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg m-4 w-full border border-gray-200 relative z-50">
      {/* 犬の画像を表示 */}
      <div className="mb-2 text-sm text-gray-700 flex">
        {dogs.map((dog, index) => (
          <div
            key={index}
            className={`mb-1 ${index > 0 ? "mt-2" : ""} flex items-center`}
          >
            <img
              src={dog.image}
              alt={`${dog.name}の画像`}
              className="w-12 h-12 object-cover rounded-full mr-2"
            />
            <div>
              <span>{dog.name}</span>
              <span className="mx-2">/</span>
              <span>{dog.breed}</span>
              <span className="mx-2">/</span>
              <span>{dog.age}歳</span>
              <span className="mx-2">/</span>
              <span>{dog.gender}</span>
            </div>
          </div>
        ))}
      </div>
      {/* 横線を追加 */}
      <hr className="border-t-2 border-gray-300 mb-4" />
      {/* 時間と場所の表示（アイコンを使用） */}
      <div className="text-sm text-gray-700">
        <div className="flex items-center mb-2">
          <span className="material-icons text-[#75A05A] mr-2">event</span>
          <span>
            {date} {time}
          </span>
        </div>
        <div className="flex items-center">
          <span className="material-icons text-[#75A05A] mr-2">place</span>
          <span>{location}</span>
        </div>
      </div>
      {/* 必要ポイントを表示 */}
      <div className="mt-2 text-sm text-gray-700">
        <span>必要ポイント: {pointsRequired}</span>
      </div>
      <Link href={`/home/walksearch/detail/${walkId}`}>
        <div className="inline-block mt-4 px-4 py-2 bg-[#75A05A] text-white rounded-full font-semibold transition-transform transform hover:scale-105 cursor-pointer text-xs">
          詳細を見る
        </div>
      </Link>
    </div>
  );
}
