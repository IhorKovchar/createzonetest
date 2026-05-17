import path from "path";
import fs from "fs"
import { NextResponse, NextRequest } from "next/server";

export async function GET (request: NextRequest, {params}: {params: Promise<{path: string}>}){
    const {path: imageName} = await params

    const imagePath = path.join(process.cwd(), "src", "static", "uploadImages", imageName)

    const isExists = fs.existsSync(imagePath)
    if(!isExists) {
        return NextResponse.json({error: "This image doesn't exits"}, {status: 404})
    }

    const buffer = fs.readFileSync(imagePath)

    return  new NextResponse(buffer)
}