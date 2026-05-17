import { IHomePageParams } from "@/interfaces/homePageType"
import styles from "./homePage.module.scss"
import PostsList from "@/components/postComponents/postsList/postsList"

export default async function HomePage({searchParams}: IHomePageParams) {
    const params = await searchParams

    const search = params.search ?? ""
    const sort = params.sort ?? "desc"
    const page = Number(params.page ?? 1)
    

    return (
        <section className={styles.homePage}>
            <div className={styles.homePage__titleBox}>
                <h1 className={styles.homePage__title}>Home Page</h1>
            </div>
            <PostsList search={search} sort={sort} page={page}/>
        </section>
    )
}