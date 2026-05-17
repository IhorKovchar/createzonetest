import Link from "next/link"
import styles from "./headerList.module.scss"
import { Session } from "next-auth"

export default function HeaderList({session}: {session: Session | null}) {
    return(
        <>
            {
                !session ? (
                    <ul className={styles.list}> 
                        <li className={styles.list__item}>
                            <Link className={styles.list__link} href={'/'}>Main Page</Link>
                        </li>
                    </ul>
                ) : (
                    <ul className={styles.list}>
                        <li className={styles.list__item}>
                            <Link href={'/'} className={styles.list__link}>Main Page</Link>
                        </li>
                        <li className={styles.list__item}>
                            <Link href={'/searchCreators'} className={styles.list__link}>Search creators</Link>
                        </li>
                        <li className={styles.list__item}>
                            <Link href={'/chats'} className={styles.list__link}>Chats</Link>
                        </li>
                        <li className={styles.list__item}>
                            <Link href={'/notification'} className={styles.list__link}>Notification</Link>
                        </li>
                        <li className={styles.list__item}>
                            <Link href={'/setting'} className={styles.list__link}>Setting</Link>
                        </li>
                        <li className={styles.list__item}>
                            <Link href={'/post/create'} className={styles.list__link}>Post</Link>
                        </li>
                    </ul>
                )   
            }
        </>
    )
}