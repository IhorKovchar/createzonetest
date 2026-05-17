import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"
import { saveFile } from "@/lib/saveFile";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { INotificationJob } from "@/lib/redis/notificationJobType";
import { User } from "@prisma/client";
import { notificationQueue } from "@/lib/queue";

export async function POST (request: NextRequest){ 
    const session = await auth()
    const email = session?.user?.email
    if(!email) {
        return NextResponse.json({ message: "Not auhotized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })
    
    try{
        const formData = await request.formData()
        const title = formData.get("title") as string
        const description = formData.get("description") as string
        const image = formData.get("image") as File
        const video = formData.get("video") as File
    
        if(!title || !description || !image || !video){
            return NextResponse.json(
                { message: "Some field are required" },
                { status: 400 }
            )
        }

        if(!image.type.startsWith("image/")){
            return NextResponse.json(
                { message: "Uploaded file must be an image" },
                { status: 400 }
            )
        }

        if(!video.type.startsWith("video/")){
            return NextResponse.json(
                { message: "Uploaded file must be a video" },
                { status: 400 }
            )
        }

        if(!user) {
            return NextResponse.json({ message: "User not found" }, {status: 404})
        }

        const imageName = await saveFile(image, "uploadImages")
        const videoName = await saveFile(video, "uploadVideos")

        const post = await prisma.post.create({
            data: {
                title,
                description,
                imageUrl: imageName,
                videoUrl: videoName,
                authorId: user.id,
                slug: slugify(title)
            }
        })

        const job: INotificationJob = {
            postId: post.id,
            senderId: post.authorId,
            senderName: String(user.name),
            message: `${user.name} created post ${post.title}`

        }

        await notificationQueue.add("send-notification", job)

        return NextResponse.json({message: "ok", post}, {status: 201})
    }catch (error){
        return NextResponse.json({message: "Server error"}, {status: 500})
    }
}

export async function GET(request: NextRequest) {
    try{
        const { searchParams } = new URL(request.url)

        const search = searchParams.get("search") || ""
        const sort= searchParams.get("sort") || "desc"
        const page = Number(searchParams.get("page") || 1)
        const limit = Number(searchParams.get("limit") || 8)

        const skip = (page - 1) * limit

        const where = {
            ...(search
                ? {
                    title: {
                        contains: search
                    }
                } : {}
            ),
        }
        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                orderBy:{
                    createdAt: sort === "asc" ? "asc" : "desc"
                },
                skip,
                take: limit,
                include: {
                    author: true
                }
            }),
            prisma.post.count({where})
        ])

        return NextResponse.json({
            posts,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        })
    } catch (error) {
        return NextResponse.json(
            {message: "Failed to fetch posts"},
            {status: 500}
        )
    }
}