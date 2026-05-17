import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import styles from "./profile.module.scss"
import Link from "next/link";
import AddFriendButton from "@/components/friendshipComponents/addFriendButton";
import { FriendshipStatus } from "@prisma/client";

export default async function Profile({ params }: {params: Promise<{profileSlug: string}>}) {
    const { profileSlug } = await params
    const authorSlug = profileSlug
    const session = await auth()
    const currentUser = Number(session?.user?.id)

    if(!session?.user?.id) {
        redirect("/user/login")
    }

    const user = await prisma.user.findUnique({
        where: {slug: authorSlug},
        select: {
            id: true,
            name: true,
            email: true,
            image: true
        }
    })

    const userPosts = await prisma.post.findMany({
        where: {
            authorId: user?.id
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    if(!user) {
        return <div>We can't find this user</div>
    } 

    const friendship = await prisma.friendship.findFirst({
        where: {
            OR: [
                { receiverId: currentUser, senderId: user.id },
                { receiverId: user.id, senderId: currentUser }  
            ],
        }
    })

    let friendshipStatus: "none" | "pending" | "accepted" = "none"

    if(friendship?.status === FriendshipStatus.PENDING) {
        friendshipStatus = "pending"
    }

    if(friendship?.status === FriendshipStatus.ACCEPTED) {
        friendshipStatus = "accepted"
    } 

    const isOwner = user.id === currentUser
    
    return (
        <section className={styles.profile}>
            <div className={styles.profile__container}>
                <div className={styles.profile__box}>
                    <h1 className={styles.profile__title}>Profile</h1>
                    <img className={styles.profile__avatar} src={user.image || "/api/avatar/default-avatar.png"} alt="" />
                    <article className={styles.profile__user}>
                        <p className={styles.profile__item}>Name: {user.name}</p>
                        <p className={styles.profile__item}>Email: {user.email}</p>
                        {
                        !isOwner && (
                            <AddFriendButton receiverId={user.id} initialStatus={friendshipStatus} />
                        ) 
                        }
                        {isOwner && <Link href={"/setting"}>
                            <button>
                                Edit Profile
                            </button>
                        </Link>}
                        
                    </article>
                </div>
                <div className={styles.profile__box}>
                    <h2 className={styles.profile__secondTitle}>Users Post:</h2>
                    <article className={styles.profile__postsGrid}>
                        {
                            userPosts.length === 0 ? (
                                <p>This user haven't post yet</p>
                            ) : (
                                userPosts.map((post) => (
                                    <Link href={`/post/${post.id}-${post.slug}`} key={post.id} className={styles.profile__postLink}>
                                        <div className={styles.profile__post}>
                                            <h3 className={styles.profile__postTitle}>{post.title}</h3>
                                            <img className={styles.profile__postImage} src={`/api/image/${post.imageUrl}`} alt="" />
                                        </div>
                                    </Link>
                                ))
                            )
                        }
                    </article>
                </div>
            </div>
        </section>
    )
}