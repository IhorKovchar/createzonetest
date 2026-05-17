
import ButtonToLogin from "./buttonToLogin"
import ButtonToRegister from "./buttonToRegister"
import styles from './header.module.scss'
import UserName from "./userName"
import HeaderList from "./headerList"
import ButtonExit from "./buttonExit"
import Link from "next/link"
import { Session } from "next-auth"
import ButtonBurger from "./buttonBurger/buttonBurger"
import { prisma } from "@/lib/prisma"


export default async function Header({session}: {session: Session | null}) {

    let userName: string | null = null
    let userSlug: string | null = null

    if (session?.user?.id) {
        const id = Number(session.user.id)
            if (!Number.isNaN(id)) {
            const user = await prisma.user.findUnique({
                where: { id },
                select: { name: true, slug: true }
            })
            userName = user?.name ?? null
            userSlug = user?.slug ?? null
        }
    }

    return(
        <header className={styles.header}>
                <nav className={styles.header__nav}>
                    <div className={styles.header__leftSide}>
                        <Link className={styles.header__title} href={"/"}>CREATEzone</Link>
                        {userName && userSlug && (
                            <div className={styles.header__mobileUser}><UserName/></div>
                        )}
                    </div>
                    <div className={styles.header__desktop}>
                        <HeaderList session={session}/>    
                        <article className={styles.header__buttons}>
                            {
                                !session?.user ? (
                                    <>
                                        <ButtonToRegister/>
                                        <ButtonToLogin/>
                                    </>

                                ) : (
                                    <div className={styles.header__userBox}>
                                    <div className={styles.header__item}><UserName/></div>
                                        <ButtonExit/>
                                    </div>
                                )
                            }
                        </article>
                    </div>
                    
                    <div className={styles.header__burger}>
                        <ButtonBurger session={session}/>
                    </div>
                </nav>
        </header>
    )
}
