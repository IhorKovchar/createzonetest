"use client"

import { useEffect, useState, useRef } from "react"
import { User } from "@prisma/client"
import styles from "./chatComponent.module.scss"
import {io, Socket} from 'socket.io-client'
import { IMessage } from "@/interfaces/messageType"
import { useRouter } from "next/navigation"

export default function ChatComponent({users, currentUser, lastMessages} : {users: User[]; currentUser: number, lastMessages: Record<number, IMessage>}) {
    const [ openChat, setOpenChat ] = useState(false)
    const [ secondUser, setSecondUser ] = useState<number | null>(null)
    const [ messageText, setMessageText ] = useState<string>("")
    const [ messages, setMessages ] = useState<IMessage[]>([])

    const firstUser = currentUser

    const socket = useRef<Socket | null>(null)
    const router = useRouter()

    async function loadHistory(user1: number, user2: number) {
        const response = await fetch(`/api/messages?userId1=${user1}&userId2=${user2}`, {
            cache: "no-store"
        })
        const data = await response.json()
        setMessages(data)
    }

    function sendMessage() {
        if(!socket.current) return
        if(firstUser == null || secondUser == null) return

        socket.current.emit("send_message", {fromId: firstUser, toId: secondUser, text: messageText})

        setMessageText("")
    }

    function backToMain() {
        setOpenChat(false)

        router.push("/chats")
    }

    useEffect(() => {
        if(!openChat) return
        if(firstUser === null || secondUser === null) return

        loadHistory(firstUser, secondUser)

        socket.current = io({query: {id: firstUser}})
        socket.current.on("get_message", (data) => {
            setMessages(prevMessages => [...prevMessages, data])
        })
    }, [openChat, firstUser, secondUser])


    return (
        <section className={styles.chat}>
                    <ul className={styles.chat__list}>
                        {
                            users.map((user) => {
                            const lastMessage = lastMessages[user.id]
                            return(
                                <li className={styles.chat__list__item} key={user.id}>
                                    <div className={styles.chat__about}>
                                        <p className={styles.chat__userName}>{user.name}</p>
                                        <p className={styles.chat__text}>{lastMessage?.text ?? "There aren't any messages"}</p>
                                    </div>
                                    <button className={styles.chat__button} onClick={() => {setSecondUser(user.id); setOpenChat(true)}}>Open</button>
                                </li>
                            )
                        })
                    }
                    </ul>
                {
                !openChat ? (
                    null
                ) : (
                        <article className={styles.chat__section}>
                            <div className={styles.chat__messages}>
                                {
                                    messages.map((message) => {
                                        const isMyMessage = message.fromId === firstUser
                                        const sender = users.find(user => user.id == message.fromId)

                                        return (
                                            <div key={message.id} className={isMyMessage ? styles.chat__myMessage : styles. chat__otherMessage}>
                                                <div className={styles.chat__header}>
                                                    <p className={styles.chat__sender}>
                                                        {sender?.name}
                                                    </p>
                                                    <p className={styles.chat__date}>
                                                        {new Date(message.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className={styles.chat__text}>
                                                    {message.text}
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <textarea className={styles.chat__textArea}  placeholder="Type a message" value={messageText} onChange={(e) => setMessageText(e.target.value)}>

                            </textarea>
                            <article className={styles.chat__buttons}>
                                <button className={styles.chat__button} onClick={() => sendMessage()}>Send</button>
                                <button className={styles.chat__button} onClick={() => backToMain()}>Close</button>
                            </article>
                        </article>
                )
            }
        </section>
    )
}