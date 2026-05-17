"use client"

import styles from "./error.module.scss"

export default function ErrorPage() {
    return (
        <section className={styles.error}>

            <h1 className={styles.error__title}>Server Error</h1>
        </section>
    )
}