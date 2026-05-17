import path from "path";
import fs from "fs"
import { NextResponse, NextRequest } from "next/server";

export async function GET (request: NextRequest, {params}: {params: Promise<{path: string}>}){
    const {path: videoName} = await params

    const videoPath = path.join(process.cwd(), "src", "static", "uploadVideos", videoName)

    const isExists = fs.existsSync(videoPath)
    if(!isExists) {
        return NextResponse.json({error: "This video doesn't exits"}, {status: 404})
    }

    const buffer = fs.readFileSync(videoPath)

    return  new NextResponse(buffer)
}