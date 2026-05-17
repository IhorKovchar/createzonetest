import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const userId1 = Number(searchParams.get("userId1"))
    const userId2 = Number(searchParams.get("userId2"))

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                {fromId: userId1, toId: userId2},
                {fromId: userId2, toId: userId1}
            ]
        },
        orderBy: {createdAt: "asc"}
    })

    return NextResponse.json(messages)
}