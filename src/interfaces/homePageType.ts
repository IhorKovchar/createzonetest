export interface IPostsListProps {
    search: string
    sort: string
    page: number
}

export interface IHomePageParams {
    searchParams: Promise<{
        search?: string
        sort?: string
        page?: number
    }>
}