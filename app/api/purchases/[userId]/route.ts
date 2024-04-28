import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// 購入履歴検索API
export const GET = async (
  req: Request,
  { params }: { params: { userId: string } }
) => {
  const userId = params.userId;
  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId: userId },
    });
    return NextResponse.json(purchases);
  } catch (err) {
    return NextResponse.json(err);
  }
};
