import { createMessage } from "@/lib/actionSocket"
import { createServer } from "http"
import next from "next"
import { Server } from "socket.io"

const port = 3000
const dev = process.env.NODE_ENV !== "production"

const app = next({ dev })
const handle = app.getRequestHandler()

async function main() { 
    await app.prepare()

    const httpServer = createServer((req, res) => {
        handle(req, res)
    })

    const io = new Server(httpServer)

    io.on("connection", (socket) => {
        const idRaw = socket.handshake.query.id
        const userId = Array.isArray(idRaw) ? idRaw[0] : idRaw

        socket.data.userId = userId
        console.log("connect", userId)

        if(userId) {
            socket.join(String(userId))
        }

        socket.on("send_message", async (data) => {
            console.log("data",data)
            try{
                const savedMessage = await createMessage(
                    Number(data.fromId),
                    Number(data.toId),
                    data.text
                )
                console.log("sended")
                io.to(String(data.toId)).emit("get_message", savedMessage)

                socket.emit("get_message", savedMessage)
            }catch(error){
                console.error("Error:", error )
            }
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id)
        })
    })

    httpServer.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`)
    })
}

main().catch((e) => {
    console.error(e)
    process.exit(1)
})