import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { sendOtp, verifyOtp } from "../services/otp";

export const sendOtpReq=()=>
{
    return useMutation({
        mutationFn:(payload:{phone:string})=>
            sendOtp(payload.phone)
    })
}

export const useVerifyOtpReq=( options? : UseMutationOptions<any,unknown,{phone:string,otp:string}>)=>
{
    return useMutation({
        mutationFn:(payload:{phone:string,otp:string})=>
            verifyOtp(payload.phone,payload.otp),
        ...options
    })
}