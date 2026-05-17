"use client"

import styles from "./videoPlayer.module.scss"

export default function VideoPlayer({src} : {src: string}) {
    return (
        <video className={styles.video}
            onMouseEnter={e => e.currentTarget.controls = true}
            onMouseLeave={e => e.currentTarget.controls = false}
            src={src}
        />
    )
}