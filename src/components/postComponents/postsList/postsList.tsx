"use server"

import styles from "./postList.module.scss"
import Link from "next/link"
import { IPostsListProps } from "@/interfaces/homePageType"
import { prisma } from "@/lib/prisma"
import Pagination from "../pagination"

export default async function PostsList({search, sort, page}: IPostsListProps) {
    const limit = 8
    const skip = (page - 1) * limit

    const where = search ? { 
        title: {
            contains: search
        }
    } : {}

    const [posts, total] = await Promise.all([
        prisma.post.findMany({
            where,
            orderBy: {
                createdAt: sort === "asc" ? "asc" : "desc"
            },
            skip,
            take: limit,
            include: {
                author: true
            }
        }),
        prisma.post.count({where})
    ])

    const totalPages = Math.ceil(total / limit)

    return(
        <section className={styles.postList} >
            <form className={styles.postList__controls} >
                <input type="text" name="search" placeholder="Search posts" defaultValue={search} className={styles.postList__input} />
                <button>Search</button>
            </form> 
            <form className={styles.postList__controls}  >
                <div className={styles.postList__selectTitle}>FILTERS</div>
                <select className={styles.postList__select} name="sort" defaultValue={sort}>
                    <option className={styles.postList__option} value="desc">Newest first</option>
                    <option className={styles.postList__option} value="asc">Oldest first</option>
                </select>
                <button>Apply</button>
            </form>

            {
                posts.length === 0 ? (
                    <p>There aren't any posts</p>
                ) : (
                    <ul className={styles.postsGrid}>
                            {
                                posts.map((post) => (
                                    <Link className={styles.postList__postLink} key={post.id} href={`/post/${post.id}-${post.slug}`}>
                                        <li className={styles.postList__postLink__box}>
                                            <div className={styles.postList__authorBox}>
                                                <div className={styles.postList__author}>Author: {post.author.name}</div>
                                            </div>
                                            <img className={styles.postList__postLink__image} src={`/api/image/${post.imageUrl}`} alt="" />
                                            <h2 className={styles.postList__postLink__title}>{post.title}</h2>
                                        </li>
                                    </Link>
                                ))
                            }
                    </ul>
                )
            }
            <Pagination currentPage={page} totalPages={totalPages} search={search} sort={sort} basePath="/"/>
        </section>
    )
}