"use client"

import { deletePost } from "@/app/actions"
import { useRouter } from "next/navigation"

export default function ButtonDeletePost({ postId }: {postId: number}) {
    const router = useRouter()
    async function handleDelete() {
        await deletePost(postId)
        router.push("/")
    } 

    return(
        <button onClick={handleDelete}>DeletePost</button>
    )
}