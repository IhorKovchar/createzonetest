"use client"

import { useState } from "react"
import { InitialStatus } from "@/interfaces/initialStatusType"
import styles from "./addFriendButton.module.scss"

export default function AddFriendButton ({receiverId, initialStatus}: {receiverId: number, initialStatus?: InitialStatus}){
    const [ status, setStatus ] = useState<InitialStatus>(initialStatus ?? "none")

    async function handleAddFriend (){
        const response = await fetch("/api/friendships", {
            method: "POST",
            body: JSON.stringify({
                receiverId
            })
        })
        
        const data = await response.json()

        if(!response.ok) {
            alert(data.message || "Something went wrong")
            return
        }

        setStatus("pending")

    }
    if(status === "accepted") {
        return <div className={styles.item}>You are friends already</div>
    }

    if(status === "pending") {
        return <div className={styles.item}>Request of friendship sent</div>
    }

    return(
        <button onClick={handleAddFriend}>Add Friend</button>
    )
}