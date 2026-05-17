import { z } from 'zod'


export const RegisterSchema = z.object({
    name: z
        .string()
        .regex(/[a-zA-Z]/, "Name must be a string")
        .min(4, "Name must be more then 4 letters")
        .max(12, "Name must be less then 12 letters"),
    email: z
        .email("Not correct email"),
    password: z
        .string()
        .min(8, "Password must be more 8 symbols")
        .max(64, "Password must be less than 64 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/\d/, " Password must contain at least one number")
        .regex(/[^A-Za-z0-9\s]/, "Password must contain at least one special character")
        .regex(/^\S+$/, "Password must not contain spaces")
})

export const LoginSchema = z.object({
    email: z.email("Not correct email"),
    password: z.string().min(6, "Password must be more 6 symbols")
})