import { getServerSession } from "next-auth";
import Image from "next/image";
import { nextAuthOptions } from "../lib/next-auth/options";
import { BookType, Purchase, User } from "../types/types";
import { getDetailBook } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";

export default async function ProfilePage() {
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchasesDetailBooks: BookType[] = [];
  if (user) {
    const res = await fetch(
      // SSR デフォルト設定。
      // CSR(useEffectを使う)だと遅くなる。
      // その都度の状態の問い合わせなのでSSGにはできない
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`
    );
    const purchaseData = await res.json();

    purchasesDetailBooks = await Promise.all(
      purchaseData.map(async (purchase: Purchase) => {
        return await getDetailBook(purchase.bookId);
      })
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">プロフィール</h1>

      <div className="bg-white shadow-md rounded p-4">
        <div className="flex items-center">
          <Image
            priority
            src={user.image || "/default_icon.png"}
            alt="user profile_icon"
            width={60}
            height={60}
            className="rounded-full"
          />
          <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
        </div>
      </div>

      <h2 className="font-medium text-lg mb-4 mt-12">購入した記事</h2>
      <div className="flex items-center gap-6">
        {purchasesDetailBooks.map((purchaseDetailBook: BookType) => (
          <PurchaseDetailBook
            key={purchaseDetailBook.id}
            purchaseDetailBook={purchaseDetailBook}
          />
        ))}
      </div>
    </div>
  );
}
