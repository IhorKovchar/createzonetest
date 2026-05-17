import SearchCreatorsClient from "@/components/friendshipComponents/searchCreatorComponent/searchCreatorComponent"
import styles from "./serachCreators.module.scss"

export default async function SearchCreators({searchParams}: {searchParams: Promise<{search?: string, page: string}>}) {
    const params = await searchParams
    const search = params.search || ""
    const page = Number(params.page) > 0 ? Number(params.page) : 1

    return (
        <section className={styles.searchCreators}>
            <div className={styles.searchCreators__titleBox}>
                <h1 className={styles.searchCreators__title}>Search Creators</h1>
            </div>
            <SearchCreatorsClient search={search} page={page}/>
        </section>
    )
}