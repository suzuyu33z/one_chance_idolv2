import Link from "next/link";

export default function New() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">まずは登録しよう！</h1>
      <Link
        href="/new/owner"
        className="block text-blue-500 hover:text-blue-700"
      >
        ワンちゃん飼ってる人！
      </Link>
      <Link
        href="/new/visitor"
        className="block text-blue-500 hover:text-blue-700"
      >
        ワンちゃん飼っていない人！
      </Link>
      <Link href="/" className="block text-blue-500 hover:text-blue-700">
        戻る
      </Link>
    </div>
  );
}
