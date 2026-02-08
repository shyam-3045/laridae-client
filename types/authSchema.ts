import z from "zod"
import { TypeOf } from "zod/v3"

export const loginSchema=z.object({
    phone:z.string("Required Field").min(10,"Phone Number must be 10 numbers").max(10,"Phone Number must be 10 numbers"),
    password:z.string().min(8,"Password must be 8 characters ")
})

export const signUpSchema=z.object({
    name:z.string().min(2,"name must be 2 characters"),
    phone:z.string("Required Field").min(10,"Phone Number must be 10 numbers").max(10,"Phone Number must be 10 numbers"),
    password:z.string().min(8,"Password must be 8 characters"),
    confirmPassword:z.string().min(8,"Password must be 8 characters"),
}).refine((data)=>data.password === data.confirmPassword,{

    message:"Password Doesn't match",
    path:['confirmPassword']
})

export type LoginFormType = z.infer<typeof loginSchema>
export type signUpFormType=z.infer<typeof signUpSchema>