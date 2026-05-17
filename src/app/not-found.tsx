import styles from "./not-found.module.scss"

export default function NotFound() {
    return (
        <section className={styles.notFound}>
            <p className={styles.notFound__status}>404</p>
            <p className={styles.notFound__description}>Unfortunately, page was not found</p>
        </section>
    )
}