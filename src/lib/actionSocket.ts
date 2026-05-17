import { prisma } from "./prisma"

export async function createMessage(fromId: number, toId: number, text: string) {
    console.log('create message')
    const message = await prisma.message.create({
        data: {
            text: text,
            fromId: fromId,
            toId: toId
        }
    })
    console.log('message',message)
    return message
}