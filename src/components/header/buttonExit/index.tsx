"use client"

import { signOut, useSession } from "next-auth/react"
import styles from "./buttonExit.module.scss"

export default function ButtonExit() {
    const { data: session } = useSession()

    if(!session) return null

    return (
        <button className={styles.buttonExit} onClick={() => signOut({callbackUrl:'/'})}>Exit</button>
    )
}