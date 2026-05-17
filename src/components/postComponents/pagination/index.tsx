"use client"

import { useRouter, useSearchParams } from "next/navigation"
import styles from "./pagination.module.scss"
import { IPaginationProps } from "@/interfaces/paginationType"

function getPagination(currentPage: number, totalPages: number) {
    if(totalPages <= 5) {
        return Array.from({length: totalPages}, (e, i) => i + 1)
    }

    if(currentPage <= 3) {
        return [1, 2, 3, 4, "...", totalPages]
    }

    if(currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1 , totalPages]
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages]
}

// -  Prev(f) [1] 2 3 4 ... 20 Next(t)
// -  Prev(t) 1 2 [3] 4 ... 20 Next(t)

// -  Prev(t) 1 ... 3 [4] 5 ... 20 Next(t)
// -  Prev(t) 1 ... 4 [5] 6 ... 20 Next(t)

// -  Prev(t) 1 ... 17 18 19 [20] Next(f)
// -  Prev(t) 1 ... [17] 18 19 20 Next(t)


export default function Pagination({currentPage, totalPages, search, sort, basePath="/"}: IPaginationProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const goToPage = (page: number) => {

        const params = new URLSearchParams(searchParams.toString())

        params.set("page", String(page))

        if(search) {
            params.set("search", search)
        } else {
            params.delete("search")
        }

        if(sort) {
            params.set("sort", sort)
        } else {
            params.delete("sort")
        }

        router.push(`${basePath}?${params.toString()}`)
    }

    const pages = getPagination(currentPage, totalPages)

    if(totalPages <= 1) return null

    return(
        <article className={styles.pagination}>
            <button className={styles.pagination__button} disabled={currentPage <= 1} onClick={() => goToPage(currentPage - 1)}>
                Prev
            </button>

            {
                pages.map((page) => 
                    page === "..." ? (
                        <div className={styles.pagination__dots}>...</div>
                    ) : (
                        <button key={page}
                            className={`${styles.pagination__button} ${currentPage === page ? styles.pagination__button__active : ""}`} 
                            onClick={() => goToPage(Number(page))} disabled={currentPage === page}>
                                {page}
                        </button>
                    )
                )
            }

            <button className={styles.pagination__button} disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>
                Next
            </button>
        </article>
    )
}