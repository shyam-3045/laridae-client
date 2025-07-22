import { useMutation } from "@tanstack/react-query";
import { sendOtp, verifyOtp } from "../services/otp";

export const sendOtpReq=()=>
{
    return useMutation({
        mutationFn:(payload:{email:string})=>
            sendOtp(payload.email)
    })
}

export const useVerifyOtpReq=()=>
{
    return useMutation({
        mutationFn:(payload:{email:string,otp:string})=>
            verifyOtp(payload.email,payload.otp)
    })
}