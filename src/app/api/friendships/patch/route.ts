import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FriendshipStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH (request: NextRequest){
    const session = await auth()
    const userId = Number(session?.user?.id)

    if(!userId){
        return NextResponse.json({message: "User doesn't authorized"}, {status: 401})
    }

    const body = await request.json()
    const friendshipId = Number(body.friendshipId)
    const action = body.action

    const friendship = await prisma.friendship.findUnique({
        where: {
            id: friendshipId
        }
    })


    if(!friendship) {
        return NextResponse.json({message: "This friendship doesn't exist"}, {status: 404})
    }

    if(friendship.status !== FriendshipStatus.PENDING){
        return NextResponse.json({message: "Request is not pending"},{status: 400})
    }

    if(friendship.receiverId !== userId) {
        return NextResponse.json({message: "You can't accept this request"}, {status: 403})
    }

    const newStatus = action === "ACCEPT" ? FriendshipStatus.ACCEPTED : FriendshipStatus.REJECTED

    const updatedFriendship = await prisma.friendship.update({
        where: {
            id: friendshipId
        },
        data: {
            status: newStatus
        }
    })
    return NextResponse.json({message: "ok", friendship: updatedFriendship}, {status: 200})

}