import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

export async function saveFile (file: File, folder: "uploadImages" | "uploadVideos"){
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const exp = file.name.split(".").pop() || ""
    const uniqueName = `${crypto.randomUUID()}.${exp}`
    const pathToSave = path.join(process.cwd(), "src", "static", folder)
    const filePath = path.join(pathToSave, uniqueName)

    await fs.mkdir(pathToSave, {recursive: true})
    await fs.writeFile(filePath, buffer)

    return uniqueName
}