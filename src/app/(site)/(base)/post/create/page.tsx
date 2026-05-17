"use client"

import { useEffect, useState } from "react"
import styles from "./create.module.scss"
import TinyEditor from "@/components/tinyEditor"

export default function CreatePostPage() {
    const [ progress, setProgress ] = useState(0)
    const [ title, setTitle ] = useState("")
    const [ description, setDescription ] = useState("")
    const [ videoName, setVideoName ] = useState("")
    const [ message, setMessage ] = useState("");
    const [ isUploading, setIsUploading ] = useState(false)

    useEffect(() => {
        if(progress === 100) {
            const timeout = setTimeout(() => {
                setProgress(0)
                setMessage("")
            }, 4000)

            return () => clearTimeout(timeout)
        }
    }, [progress])

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        
        if(!file) { 
            setVideoName("")
            return
        }

        setVideoName(file.name)
    }

    const handelSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        setProgress(0)
        setIsUploading(true)

        const form = e.currentTarget
        const formData = new FormData(form)

        formData.set("description", description)

        const xml = new XMLHttpRequest()
        xml.open("POST", "/api/posts")

        xml.upload.onprogress = (e) => {
            if(e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100)
                setProgress(percent)
            }
        }
        xml.onload = () => {
            setIsUploading(false)

            if(xml.status >= 200 && xml.status < 300) {
                setMessage("Post was succesfully created")
                setTitle("")
                setDescription("")
                setVideoName("")
                setProgress(100)
                form.reset()
            }else{
                setMessage("Something wrong with post")
            }
        }

        xml.onerror = () => {
            setIsUploading(false)
            setMessage("Something went wrong")
        }

        xml.send(formData)
    }

    return (
        <section className={styles.createPost} >
            <h1 className={styles.createPost__title}>Create Post</h1>

            <form className={styles.createPost__form} onSubmit={handelSubmit}>
                <input className={styles.createPost__titleInput} type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title of Post" required />
                <div className={styles.createPost__description}>
                    <TinyEditor value={description} onChange={(content) => setDescription(content)} />
                </div>
                <div className={styles.createPost__fileSections}>
                    <label className={styles.createPost__otherTitle} htmlFor="image">Image</label>
                    <input className={styles.createPost__file} type="file" name="image" accept="image/*" required/>
                </div>
                <div className={styles.createPost__fileSections}>
                    <label className={styles.createPost__otherTitle} htmlFor="video">Video</label>
                    <input className={styles.createPost__file} type="file" name="video" accept="video/*" onChange={handleVideoChange} required/>
                    {
                        videoName && (
                            <p className={styles.createPost__fileName}>
                                Choosen video: <strong>{videoName}</strong>
                            </p>
                        )
                    }
                </div>
                <div className={styles.createPost__progress}>
                    <p className={styles.createPost__percent}>{progress}%</p>
                </div>
                <button className={styles.createPost__button} type="submit" disabled={isUploading}>
                    {isUploading ? "Uploading" : "Create Post"}
                </button>
            </form>
            {
                message && (
                    <p className={styles.createPost__otherTitle}>
                        {message}
                    </p>
                )
            }
        </section>
    )
}