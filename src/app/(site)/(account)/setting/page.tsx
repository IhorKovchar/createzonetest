import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import styles from "./setting.module.scss"
import ChangeProfile from "@/components/settingComponents/changeProfile"
import SwitcherTheme from "@/components/settingComponents/switcherTheme"

export default async function Setting() {
    const session = await auth()

    if(!session?.user?.id){
        redirect("/user/login")
    }

    const userId = Number(session.user.id)

    const user = await prisma.user.findUnique({
        where: { id: userId},
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            slug: true
        }
    })

    return (
        <section className={styles.setting}>
            <h1 className={styles.setting__title}>
                Setting
            </h1>

            <ChangeProfile currentName={user?.name || ""}/>
            <SwitcherTheme/>
        </section>
    )
}