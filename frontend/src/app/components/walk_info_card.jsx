import React from "react";
import Link from "next/link";

export default function WalkInfoCard({ date, time, location, dogs, walkId }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md m-4 w-full">
      <div className="mb-2 text-left">
        <p className="text-lg font-bold text-gray-800 mb-1">日時</p>
        <p className="text-sm text-gray-600 mb-2">
          {date} {time}
        </p>
      </div>
      <div className="mb-2 text-left">
        <p className="text-lg font-bold text-gray-800 mb-1">場所</p>
        <p className="text-sm text-gray-600 mb-2">{location}</p>
      </div>
      <div className="text-left">
        <p className="text-lg font-bold text-gray-800 mb-1">わんちゃん</p>
        <div className="text-sm text-gray-600">
          {dogs.map((dog, index) => (
            <p key={index}>
              {dog.name} / {dog.breed} / {dog.age}歳 / {dog.gender}
            </p>
          ))}
        </div>
      </div>
      <Link href={`/home/walksearch/detail/${walkId}`}>
        <button className="mt-4 px-4 py-2 bg-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-400 transition-colors">
          詳細を見る
        </button>
      </Link>
    </div>
  );
}
