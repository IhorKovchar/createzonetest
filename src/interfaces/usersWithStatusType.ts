export interface IUsersWithStatus {
    id: number
    name: string
    slug: string
    relationId: number | null
    status: "NONE" | "OUTCOMING" | "INCOMING" | "FRIEND"
    image: string
}

export interface ISearchCreatorsResponse {
    users: IUsersWithStatus[]
    totalPages: number
}