"use client"

import { signIn } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from "./loginComponent.module.scss"

export default function LoginComponent() {
    const router = useRouter()
    const [error, setError] = useState<string | undefined>()

    useEffect(() => {
        if(!error) return
    }, [error])

    async function handleSubmit(formData: FormData) {
        const email = formData.get("email")
        const password = formData.get("password")

        const response = await signIn("credentials",{ 
            email,
            password,
            redirect: false
        })
        
        if(response.error) {
            setError("Somethink went wrong, wrong password or email")
        }else {
            router.refresh()
            setError(undefined)
            redirect("/")
        }

    }
    
    return (
        <section className={styles.login}>
            <form className={styles.login__form} action={handleSubmit}>
                    <input className={styles.login__form__input} type="email" placeholder="Your email" name="email" />
                    <input className={styles.login__form__input} type="password" placeholder="Write your password" name="password" />
                    {error && <p className={styles.login__form__error}>{error}</p>}
                    <button className={styles.login__form__button}>SingIn</button>
            </form>
            <button className={styles.login__buttonGitHub} onClick={() => signIn("github", {redirectTo: "/"})}>Sing In With GitHub</button>
        </section>
    )
}