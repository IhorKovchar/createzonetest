import { prisma } from "@/lib/prisma"
import ChatComponent from "@/components/chatComponent"
import { auth } from "@/lib/auth"
import styles from "./chat.module.scss"
import { FriendshipStatus } from "@prisma/client"

export default async function Chats() {
    const session = await auth()
    const currentUser = Number(session?.user?.id)
    const friendships = await prisma.friendship.findMany({
        where: {
            status: FriendshipStatus.ACCEPTED,
            OR: [
                {receiverId: currentUser},
                {senderId: currentUser}
            ]
        },
        include: {
            WhoSender: true,
            WhoGetter: true
        }
    })

    const users = friendships.map(friendship => friendship.senderId === currentUser ? friendship.WhoGetter : friendship.WhoSender)

    const allMessages = await prisma.message.findMany({
        where: {
            OR: [
                {fromId: currentUser},
                {toId: currentUser}
            ]
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const lastMessagesMap = new Map<number, typeof allMessages[number]>()
     for (const message of allMessages) {
        const otherUserId = message.fromId === currentUser ? message.toId : message.fromId
        if (!lastMessagesMap.has(otherUserId)) {
            lastMessagesMap.set(otherUserId, message)
        }
    }

    const lastMessages = Object.fromEntries(lastMessagesMap)

    return (
        <section className={styles.main}>
            <ChatComponent users={users} currentUser={currentUser} lastMessages={lastMessages} />
        </section>
    ) 
}