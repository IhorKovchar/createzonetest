"use client"

import { IFriendshipButton } from "@/interfaces/friendshipButtonType";
import { useRouter } from "next/navigation";

export default function FriendshipButton({friendshipId, action, label}: IFriendshipButton) {
    const router = useRouter()

    async function handleAction() {
        const response = await fetch("/api/friendships/patch", {
            method: "PATCH",
            body: JSON.stringify({
                friendshipId,
                action
            })
        })

        const data = await response.json()
        if(!response){
            alert(data.message || "Something went wrong")
            return
        }
        router.refresh()

    }

    return (
        <button onClick={handleAction}>
            {label}
        </button>
    )
}