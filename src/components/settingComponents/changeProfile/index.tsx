"use client"

import { updateProfileAvatar } from "@/app/actions"
import { useState } from "react"
import styles from "./changeProfile.module.scss"

export default function ChangeProfile({currentName}: {currentName: string}) {
    const [error, setError] = useState<string | null>(null)
    const [success, setSucces] = useState<string | null>(null)

    async function handleAction(formData: FormData) {
        setError(null)
        setSucces(null)

        const result = await updateProfileAvatar(formData)

        if(result.error) {
            setError(result.error)
            return
        }

        setSucces("Profile updated")
    }

    return (
        <form action={handleAction} className={styles.changeProfile}>
            <div className={styles.changeProfile__box}>
                <h4 className={styles.changeProfile__title}>New avatar</h4>
                <input type="file" name="image" accept="image/*" />
            </div>
            <div className={styles.changeProfile__box}>
                <h4 className={styles.changeProfile__title}>New name</h4>
                <input type="text" name="name" defaultValue={currentName} placeholder="Enter new name" />
            </div>

            <button type="submit">Save</button>

            {error && <p className={styles.changeProfile__error}>{error}</p>}
            {success && <p className={styles.changeProfile__success}>{success}</p> }
        </form>
    )
}