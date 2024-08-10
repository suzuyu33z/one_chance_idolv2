import Link from "next/link";

export default function WalkRegi() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">新たなさんぽを登録！</h1>
      <Link href="/home" className="text-blue-500 hover:text-blue-700">
        戻る
      </Link>
    </div>
  );
}
