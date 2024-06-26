import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookType } from "../types/types";

const PurchaseProduct = ({
  purchaseDetailBook,
}: {
  purchaseDetailBook: BookType;
}) => {
  return (
    <Link
      href={`/book/${purchaseDetailBook.id}`}
      className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none w-[400px]"
    >
      <Image
        priority
        src={purchaseDetailBook.thumbnail.url}
        alt={purchaseDetailBook.title}
        width={450}
        height={350}
        className="rounded-t-md w-full aspect-[16/9] object-cover object-center"
      />
      <div className="px-4 py-4 bg-slate-100 rounded-b-md w-full">
        <h2 className="text-lg font-semibold">{purchaseDetailBook.title}</h2>
        <div
          className="mt-2 text-lg text-slate-600 excerpt"
          dangerouslySetInnerHTML={{ __html: purchaseDetailBook.content }}
        />
        <p className="mt-2 text-md text-slate-700">
          値段：{purchaseDetailBook.price}円
        </p>
      </div>
    </Link>
  );
};

export default PurchaseProduct;
