"use client"

import Link from "next/link"
import styles from "./buttonToBlog.module.scss"

export default function ButtonToBlog({authorSlug}: {authorSlug: string}) {
    if(!authorSlug) return null

    return (
        <div className={styles.content}>
            <Link className={styles.content__link} href={`/profile/${authorSlug}`}>
                <button className={styles.content__button}>
                    Go to Blog
                </button>
            </Link>
            <Link className={styles.content__link} href={`/chats`}>
                <button className={styles.content__button}>
                        Chat
                </button>
            </Link>
        </div>

    )
}