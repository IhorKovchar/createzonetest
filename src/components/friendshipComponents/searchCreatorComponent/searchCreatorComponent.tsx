
import Link from "next/link";
import styles  from "./searchCreatorComponent.module.scss"
import AddFriendButton from "../addFriendButton";
import Pagination from "@/components/postComponents/pagination";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FriendshipStatus } from "@prisma/client";

export default async function SearchCreatorsClient({search, page}: {search: string, page: number}) {
    const session = await auth()
    const currentUser = Number(session?.user?.id)

    const limit = 8
    const skip = (page - 1) * limit

    const where = search ? {
        name: {
            contains: search
        },
    } : {
        id: {
            not: currentUser
        }
    }

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                slug: true
            }
        }),
        prisma.user.count({where})
    ])

    const totalPages = Math.ceil(total / limit)

    const friendships = currentUser ? await prisma.friendship.findMany({
        where: {
            OR: [
                {senderId: currentUser}, {receiverId: currentUser}
            ]
        },
        select: {
            senderId: true,
            receiverId: true,
            status: true
        }
    }) : []

    const usersWithStatus = users.map((user) => {
        if (user.id === currentUser) {
            return { ...user, status: "ME" as const }
        }

        const friendship = friendships.find(
            (f) =>
                (f.senderId === currentUser && f.receiverId === user.id) ||
                (f.receiverId === currentUser && f.senderId === user.id)
        )

        if (!friendship) {
            return { ...user, status: "NONE" as const }
        }

        if (friendship.status === FriendshipStatus.ACCEPTED) {
            return { ...user, status: "FRIEND" as const }
        }

        if (
            friendship.status === FriendshipStatus.PENDING &&
            friendship.senderId === currentUser
        ) {
            return { ...user, status: "OUTCOMING" as const }
        }

        if (
            friendship.status === FriendshipStatus.PENDING &&
            friendship.receiverId === currentUser
        ) {
            return { ...user, status: "INCOMING" as const }
        }

        return { ...user, status: "NONE" as const }
    })

    return(
        <section className={styles.searchBox}>
            <form className={styles.searchBox__form}>
                <input className={styles.searchBox__input} type="text" name="search" defaultValue={search} placeholder="Search by name" />
            </form>

            <article className={styles.searchBox__usersBox}>
                {
                    users.length === 0 ? (
                        <p>No one found</p>
                    ) : (

                        <ul className={styles.searchBox__users}>
                            {
                                usersWithStatus.map((user) => (
                                        <Link key={user.id} className={styles.searchBox__link} href={`/profile/${user.slug}`}>
                                            <li className={styles.searchBox__user} key={user.id}>
                                                <div className={styles.searchBox__userName}>{user.name}</div>
                                                <img className={styles.searchBox__image} src={user.image || "/api/avatar/default-avatar.png"} alt="" />
                                                {user.status === "NONE" && (
                                                    <AddFriendButton receiverId={user.id}/>
                                                )}
                                                {user.status === "OUTCOMING" && <div className={styles.searchBox__status}>Request of friendship sent</div> }
                                                {user.status === "INCOMING" && <div className={styles.searchBox__status}>Incoming request of friendship</div> }
                                                {user.status === "FRIEND" && <div className={styles.searchBox__status}>Friends</div> }
                                            </li>
                                        </Link>
                                ))
                            }
                        </ul>
                    )
                }
            </article>
            <Pagination currentPage={page} totalPages={totalPages} search={search} basePath="/searchCreators"/>
        </section>
    )
}