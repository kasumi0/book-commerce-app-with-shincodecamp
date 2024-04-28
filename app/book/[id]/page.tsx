import Image from "next/image";
import React from "react";
import { getDetailBook } from "../../lib/microcms/client";

const DetailBook = async ({ params }: { params: { id: string } }) => {
  const book = await getDetailBook(params.id);//SSR  

  return (
    <div className="w-[min(100%,1000px)] bg-white shadow-lg rounded-lg overflow-hidden mx-auto my-12">
      <Image
        src={book.thumbnail.url}
        alt={book.title}
        className="w-full aspect-[16/9] object-cover object-center"
        width={700}
        height={700}
      />
      <div className="p-8">
        <h2 className="text-2xl font-bold">{book.title}</h2>
        <div
          className="text-gray-700 mt-2 content-body"
          dangerouslySetInnerHTML={{ __html: book.content }}
        />

        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">
            公開日: {new Date(book.publishedAt as any).toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            最終更新: {new Date(book.updatedAt).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
export default DetailBook