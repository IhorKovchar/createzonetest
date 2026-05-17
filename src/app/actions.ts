"use server"

import { prisma } from "@/lib/prisma";
import { RegisterSchema } from "@/lib/zod";
import { IRegisterUser } from "@/interfaces/registerType";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import path from "path";
import { unlink } from "fs/promises";
import { revalidatePath } from "next/cache";
import fs from 'fs/promises'
import { Theme } from "@prisma/client";
import { isValidTheme } from "@/lib/theme/theme";
import { cookies } from "next/headers";
import { error } from "console";

export async function registerUser(formData: FormData) {
    const validation = RegisterSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
    })

    if(!validation.success) {
        return {error: validation.error!.issues[0].message}
    }

    const { name, email, password } = validation.data as IRegisterUser

    const hashPassword = await bcrypt.hash(password, 10)

    let imagePath = "/api/avatar/default-avatar.png"
    
    const image = formData.get("image") as File | null

    if(image && image.size > 0) {
        if(!image.type.startsWith("image/")) {
            return { error: "File must be an image" }
        }

        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const pathToSave = path.join(process.cwd(), "src", "static", "avatars")
        const pathFile = path.join(pathToSave, image.name)

        await fs.mkdir(pathToSave, {recursive: true})
        await fs.writeFile(pathFile, buffer)
        imagePath = `/api/avatar/${image.name}`
    }

    const existingEmail = await prisma.user.findUnique({
        where:  {email}
    })

    const existingName = await prisma.user.findFirst({
        where: {name}
    })

    if(existingEmail) {
        return {error: "Email already used"}
    }

    if(existingName) {
        return {error: "Name already used"}
    }

    await prisma.user.create({
        data: {   
            name, 
            email, 
            password: hashPassword,
            slug: slugify(email),
            image: imagePath  
        }
    })

    return { success: true }
}

export async function deletePost(postId: number) {
    const session = await auth()
    const currentUser = Number(session?.user?.id)

    if(!currentUser) {
        throw new Error("User isn't authorized")
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    if(!post) {
        throw new Error("We did't search post")
    }

    const imagePath = post.imageUrl ? path.join(process.cwd(), "src", "static", "uploadImages", post.imageUrl): null
    const videoPath = post.videoUrl ? path.join(process.cwd(), "src", "static", "uploadVideos", post.videoUrl): null

    if(imagePath) {
        await unlink(imagePath)
    }

    if(videoPath) {
        await unlink(videoPath)
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })
}

export async function updateProfileAvatar(formData: FormData) {
    const session = await auth()

    if(!session?.user?.id) {
        return { error: "Unauhorized" }
    }

    const userId = Number(session.user.id)
    
    const name = String(formData.get("name")) 
    const image = formData.get("image") as File | null

    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { image: true, slug: true }
    })

    if(!currentUser) {
        return { error: "User not found" }
    }

    const dataToUpdate: {name?: string, image?: string} = {}

    if(name) {
        dataToUpdate.name = name
    }

    if(image && image.size > 0) {
        if(!image.type.startsWith("image/")) {
            return { error: "File must be an image" }
        }
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const pathToSave = path.join(process.cwd(), "src", "static", "avatars")
        const pathFile = path.join(pathToSave, image.name)
    
        await fs.mkdir(pathToSave, {recursive: true})
        await fs.writeFile(pathFile, buffer)
        dataToUpdate.image = `/api/avatar/${image.name}`
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
        select: { slug: true }
    })

    revalidatePath("/setting")
    revalidatePath(`/profile/${updatedUser.slug}`)

    return { succes: true }
}

export async function saveThemeAction(theme: Theme) {
    if(!isValidTheme(theme)) {
        return new Error("invalid them value")
    };

    const cookie = await cookies();
    cookie.set("theme", theme, {
        httpOnly: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/"
    })

    const session = await auth()
    if(session?.user?.id) {
        await prisma.user.update({
            where: {id: Number(session.user.id)},
            data: {theme}
        })
    }
}