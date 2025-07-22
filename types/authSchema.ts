import z from "zod"
import { TypeOf } from "zod/v3"

export const loginSchema=z.object({
    email:z.email("Invalid Format"),
    password:z.string().min(8,"Password must be 8 characters ")
})

export const signUpSchema=z.object({
    name:z.string().min(2,"name must be 2 characters"),
    email:z.email("Invalid Email"),
    password:z.string().min(8,"Password must be 8 characters"),
    confirmPassword:z.string().min(8,"Password must be 8 characters"),
}).refine((data)=>data.password === data.confirmPassword,{

    message:"Password Doesn't match",
    path:['confirmPassword']
})

export type LoginFormType = z.infer<typeof loginSchema>
export type signUpFormType=z.infer<typeof signUpSchema>