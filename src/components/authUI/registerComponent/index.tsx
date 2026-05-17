'use client'

import { registerUser } from "@/app/actions"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import styles from "./registerComponent.module.scss"

export default function RegisterComponent() {
    const router = useRouter()

    const [ error, setError ] = useState<string| undefined>()
    const [ name, setName] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
 
    async function handlSubmit(formdata: FormData) {
        const email = String(formdata.get("email"))
        const password = String(formdata.get("password"))

        const response = await registerUser(formdata)

        if(response.error) {
            setError(response.error)
            return
        }else {
            setError(undefined)
        }

        await signIn("credentials", {
            email,
            password,
            redirect: false
        })
        router.push("/")
        router.refresh()
    }

    return (
        <form className={styles.form} action={handlSubmit}>
            <div>
                <h4>Choose your avatar</h4>
                <input type="file" name="image" onChange={() => setError(undefined)} />
            </div>
            <input className={styles.form__input} type="text" name="name" value={name} onChange={(e) => {setName(e.target.value); setError(undefined) }}  placeholder="Write your account name"/>
            <input className={styles.form__input} type="email" name="email" value={email} onChange={(e) => {setEmail(e.target.value); setError(undefined)}} placeholder="Your email"/>
            <input className={styles.form__input} type="password" name="password" value={password} onChange={(e) => {setPassword(e.target.value); setError(undefined) }} placeholder="Create your password" />
            {error && <p className={styles.form__error}>{error}</p>}
            <button className={styles.form__button}>Create Profile</button>
        </form>
    )
}