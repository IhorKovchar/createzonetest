export interface IPost {
    id: number
    title: string
    slug: string
    imageUrl: string
    author: {
        name: string
    }
}

export interface IPostsResponse {
    posts: IPost[]
    total: number
    page: number
    limit: number
    totalPages: number
}