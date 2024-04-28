import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "./types/types";
import { nextAuthOptions } from "./lib/next-auth/options";

// eslint-disable-next-line @next/next/no-async-client-component
// サーバコンポーネント！！
export default async function Home() {
  const { contents } = await getAllBooks();
  // サーバーサイドでsessionを取得
  // useSessionだとCSRになってしまう
  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchaseBookIds: string[];

  if (user) {
    const res = await fetch(
      // SSR デフォルト設定。
      // CSR(useEffectを使う)だと遅くなる。
      // その都度の状態の問い合わせなのでSSGにはできない
      `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`
    );
    const purchaseData = await res.json();

      purchaseBookIds = purchaseData.map(
        (purchaseBook: Purchase) => purchaseBook.bookId
      );
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {contents.map((book: BookType) => (
          <Book
            key={book.id}
            book={book}
            isPurchased={user && purchaseBookIds.includes(book.id)}
          />
        ))}
      </main>
    </>
  );
}
