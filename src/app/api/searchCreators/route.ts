import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { FriendshipStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
    try{
        const {searchParams} = new URL(request.url)

        const session = await auth()
        const currentUser = Number(session?.user?.id)
    
        const query = searchParams.get("query")?.trim() || ""
        const page = Number(searchParams.get("page")) || 1
        const limit = Number(searchParams.get("limit")) || 6
        const skip = (page - 1) * limit

        const where = {
            id: {
                not: currentUser
            },
            ...(query ? {
                    name: {
                        contains: query
                    }
            } : {})
        }

        const allUsers = await prisma.user.count({
            where: where
        })

        const users = await prisma.user.findMany({
            where: where,
            orderBy: {
                name: "asc"
            },
            skip,
            take: limit
        })

        const friendship = await prisma.friendship.findMany({
            where: {
                OR: [
                    {receiverId: currentUser},
                    {senderId: currentUser}
                ]
            }
        })

        const usersWithStatus = users.map((user) => {
            const relation = friendship.find(
                (friend) => (
                    friend.senderId === currentUser && friend.receiverId === user.id ||
                    friend.senderId === user.id && friend.receiverId === currentUser
                )
            )
            let status: "NONE" | "OUTCOMING" | "INCOMING" | "FRIEND" = "NONE"
            
            if(relation) {
                if(relation.status === FriendshipStatus.PENDING) {
                    status = relation.senderId === currentUser ? "OUTCOMING" : "INCOMING"
                } else if(relation.status === FriendshipStatus.ACCEPTED) {
                    status = "FRIEND"
                }
            }
    
            return {
                ...user,
                relationId: relation?.id ?? null,
                status
            }
        })

        const totalPages = Math.ceil(allUsers / limit)
        
        return NextResponse.json({
            users: usersWithStatus,
            totalPages
        })

    } catch(error) {
        return NextResponse.json(
            {message: "Failed to fetch creators"}, 
            {status: 500}
        )
    }
}
