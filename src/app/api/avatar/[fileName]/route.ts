import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs"

export async function GET(request: NextRequest, {params}: {params: Promise<{fileName: string}>}) {
    const { fileName } = await params

    const filePath = path.join(process.cwd(), "src", "static", "avatars", fileName)

    const exists = fs.existsSync(filePath)

    if(!exists) {
        return NextResponse.json({error: "Avatar not found"}, {status: 404})
    }

    const buffer = fs.readFileSync(filePath)

    // const ext = path.extname(fileName).toLowerCase()

    return new NextResponse(buffer)
}