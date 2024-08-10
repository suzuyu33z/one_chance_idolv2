import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-green-100 py-4 flex justify-around items-center">
      <Link href="/home" className="flex flex-col items-center">
        <span className="material-icons" style={{ fontSize: "24px" }}>
          home
        </span>
        <p className="text-xs">ホーム</p>
      </Link>
      <Link href="/home/history" className="flex flex-col items-center">
        <span className="material-icons" style={{ fontSize: "24px" }}>
          history
        </span>
        <p className="text-xs">マッチ履歴</p>
      </Link>
      <Link href="/home/walksearch" className="flex flex-col items-center">
        <span className="material-icons" style={{ fontSize: "24px" }}>
          search
        </span>
        <p className="text-xs">犬検索</p>
      </Link>
      <Link href="/home/walkregi" className="flex flex-col items-center">
        <span className="material-icons" style={{ fontSize: "24px" }}>
          pets
        </span>
        <p className="text-xs">散歩登録</p>
      </Link>
      <Link href="/home/edition" className="flex flex-col items-center">
        <span className="material-icons" style={{ fontSize: "24px" }}>
          person
        </span>
        <p className="text-xs">プロフ変更</p>
      </Link>
    </footer>
  );
}
