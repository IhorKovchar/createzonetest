import { prisma } from "@/lib/prisma"
import { INotificationJob } from "@/lib/redis/notificationJobType"
import { FriendshipStatus } from "@prisma/client"
import { Worker, Job } from "bullmq"
import IORedis from "ioredis"
 
const redis = new IORedis(6379, {
    maxRetriesPerRequest: null
})

const worker = new Worker<INotificationJob>("notifications", async (job: Job<INotificationJob>) => {
    console.log("Job start:", job.id, job.name, job.data)
    
    const currentUser = job.data.senderId

    if(!currentUser) {
        throw new Error("Unauthorized")
    }

    const allFriendships = await prisma.friendship.findMany()
    console.log("All friendships:", allFriendships)

    const followers = await prisma.friendship.findMany({
        where: {
            status: FriendshipStatus.ACCEPTED,
            OR: [
                { senderId: Number(currentUser) },
                { receiverId: Number(currentUser) } 
            ]
        }
    })

    console.log("Current user:", currentUser)
    console.log("Followers:", followers)

    await prisma.notification.createMany({
        data: followers.map((follow) => {
            const receiverId = follow.senderId == currentUser ? follow.receiverId : follow.senderId
            return {
                friendId: receiverId,
                senderId: currentUser,
                message: job.data.message
            } 
        })
    })

    console.log("Notifications created:", followers.length)

}, {
    connection: redis,
    concurrency: 5
})

console.log("notification worker start")

worker.on("completed", (job) => {
    console.log("Job completed:", job.id)
})

worker.on("failed", (job, error) => {
    console.log("Job failed", job?.id, error.message)
})

worker.on("error", (error) => {
    console.log("Worker failed", error)
})