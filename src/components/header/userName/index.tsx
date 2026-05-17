import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import styles from "./userName.module.scss"

export default async function UserName() {
    const session = await auth()
    if(!session?.user?.id) {
        return null
    }
    const currentUser = Number(session?.user?.id)
    if(Number.isNaN(currentUser)) {
        return null
    }
    const user = await prisma.user.findUnique({
        where: {
            id: currentUser
        },
    })
    if(!user) {
        return null
    }

    return (
        <div className={styles.userBox}>
            <Link className={styles.userBox__userName} href={`/profile/${user?.slug}`}>Creator: <span>{user.name}</span></Link>
        </div>
    )
}