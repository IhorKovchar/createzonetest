import { prisma } from "@/lib/prisma";
import styles from "./post.module.scss"
import ButtonDeletePost from "@/components/postComponents/buttonDeletePost";
import { auth } from "@/lib/auth";
import ButtonToBlog from "@/components/buttonToBlog";
import VideoPlayer from "@/components/videoPlayer/videoPlayer";

export default async function PostPage ({ params }: { params: Promise<{postSlug: string}> }){
    const session = await auth()
    const currentUser = Number(session?.user?.id)
    const { postSlug } = await params
    const postId = Number(postSlug.split("-")[0])

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        },
        include: {
            author: {
                select: {
                    name: true,
                    image: true,
                    slug: true
                }
            }
        }
    })

    if(!post) {
        return <div>We can't find this post</div>
    }

    return (
        <section className={styles.post}>
            <div className={styles.post__container}>
                <div className={styles.post__box}>
                    <img className={styles.post__avatar} src={post.author.image || '/api/avatar/default-avatar.png'} alt="" />
                    <h3 className={styles.post__userName}>{post.author.name}</h3>
                    <ButtonToBlog authorSlug={post.author.slug}/>
                </div>
                <div className={styles.post__box}>
                    <h1 className={styles.post__title}>
                        {post.title}
                    </h1>
                    <img className={styles.post__logo} src={`/api/image/${post.imageUrl}`} alt="" />
                    <VideoPlayer src={`/api/video/${post.videoUrl}`}/>

                    {
                        currentUser === post.authorId ? (
                            <ButtonDeletePost postId={postId} />
                        ) : null
                    }
                </div>
                <p className={styles.post__descriptions} dangerouslySetInnerHTML={{__html: post.description}} suppressHydrationWarning/>
            </div>
        
        </section>
    )
}