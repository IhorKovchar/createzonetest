import FriendshipButton from "@/components/friendshipComponents/friendshipButton"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FriendshipStatus } from "@prisma/client"
import styles from "./notification.module.scss"

export default async function Notification() {
    const session = await auth()
    const userId = Number(session?.user?.id)

    const allRelation = await prisma.friendship.findMany({
        where:{
            receiverId: userId,
            status: FriendshipStatus.PENDING
        },
        include: {
            WhoSender: true
        }
    })

    const newPosts = await prisma.notification.findMany({
        where: {
            friendId: userId
        },
        orderBy: {
            id: "desc"
        },
    })

    return (
        <section className={styles.notification}>
            <h1 className={styles.notification__title}>Notification</h1>
            {allRelation.length === 0 && <h3 className={styles.notification__secondTitle}>There aren't any friendship requests</h3>}

            {
                allRelation.map((friend) => (
                    <article className={styles.notification__box} key={friend.id}>
                        <p className={styles.notification__item}>Request of friendship</p>
                        <div className={styles.notification__user}>
                            <p className={styles.notification__userName}>{friend.WhoSender.name}</p>
                            <FriendshipButton friendshipId={friend.id} action="ACCEPT" label="Accept"/>
                            <FriendshipButton friendshipId={friend.id} action="REJECT" label="Reject"/>
                        </div>
                    </article>
                ))
            }
            
            {
                newPosts.map((notification) => (
                    <div className={styles.notification__newPost} key={notification.id}>
                        <p className={styles.notification__message}>{notification.message}</p>
                    </div>
                ))
            }
        </section>
    )
}