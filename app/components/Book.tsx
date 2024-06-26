"use client";

import Image from "next/image";
import { BookType, User } from "../types/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

type BookProps = {
  book: BookType;
  isPurchased: boolean;
  user: User
};
// eslint-disable-next-line react/display-name
const Book = ({ book, isPurchased, user }: BookProps) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleCancel = () => {
    setShowModal(false);
  };

  const handlePurchaseClick = () => {
    if (isPurchased) {
      alert("その商品は購入済みです");
    } else {
      setShowModal(true);
    }
  };

  const startCheckout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: book.title,
            price: book.price,
            userId: user?.id,
            bookId: book.id,
          }),
        }
      );
      const responseData = await response.json();
      if (responseData) {
        router.push(responseData.checkout_url);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePurchaseConfirm = () => {
    if (!user) {
      setShowModal(false);
      // ログインページへリダイレクト
      router.push("/api/auth/signin");
    } else {
      // stripeで決済
      startCheckout();
    }
  };

  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center m-4">
        <a
          onClick={handlePurchaseClick}
          className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none w-[400px]"
        >
          <Image
            priority
            src={book.thumbnail.url}
            alt={book.title}
            width={400}
            height={300}
            className="rounded-t-md w-full aspect-[16/9] object-cover object-center"
          />
          <div className="px-4 py-4 bg-slate-100 rounded-b-md w-full">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <div
              className="mt-2 text-lg text-slate-600 excerpt"
              dangerouslySetInnerHTML={{ __html: book.content }}
            />
            <p className="mt-2 text-md text-slate-700">値段：{book.price}円</p>
          </div>
        </a>

        {showModal && (
          <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex justify-center items-center modal">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl mb-4">本を購入しますか？</h3>
              <button
                onClick={handlePurchaseConfirm}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
              >
                購入する
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Book;
