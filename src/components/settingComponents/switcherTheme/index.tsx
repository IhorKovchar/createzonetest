"use client"

import styles from "./switcherTheme.module.scss"
import { useTheme } from "@/context/themeContext"

export default function SwitcherTheme() {
    const {theme, setTheme} = useTheme()
    
    return(
        <section className={styles.switcher}>
            <h2>There now {theme}</h2>
            <button onClick={() => setTheme("LIGHT")} className={styles.switcher__button}>LIGHT</button>
            <button onClick={() => setTheme("DARK")} className={styles.switcher__button}>DARK</button>
        </section>
    )
}