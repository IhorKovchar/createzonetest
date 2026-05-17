import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FriendshipStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request: NextRequest){
    const session = await auth()
    const email = session?.user?.email
    const body = await request.json()
    const receiverId = body.receiverId

    if(!receiverId && !Number(receiverId)) {
        return NextResponse.json({message: "Error on server"}, {status: 500})
    }

    if(!email) {
        return NextResponse.json({message: "Not authorize"}, {status: 401})
    }
    
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if(!user) {
        return NextResponse.json({message: "There isn't this user"}, {status: 401})
    }

    if(user.id === receiverId) {
        return NextResponse.json({message: "You can't send request to yourself"})
    }
    
    const IfFriendshipExist = await prisma.friendship.findFirst({
        where: {
            OR: [
                {senderId: user.id, receiverId: receiverId},
                {senderId: receiverId, receiverId: user.id}
            ]
        }
    })

    if(IfFriendshipExist){
        return NextResponse.json({message: "This friendship already exist"})
    }



    const friendship = await prisma.friendship.create({
        data: {
            senderId: user.id,
            receiverId: receiverId,
            status: FriendshipStatus.PENDING
        }
    })

    return NextResponse.json({message: "ok", friendship}, {status: 201})
}