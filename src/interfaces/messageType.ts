export interface IMessage {
    id: number
    text: string
    createdAt: Date,
    fromId: number,
    toId: number
}