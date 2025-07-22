import api from "@/lib/config/axios";
import { loginFormData } from "@/types/common";
import { userDetails } from "@/types/userDetails";

export const Login=async (data:loginFormData,typeOfAuth:string)=>
{
    const res= typeOfAuth === "Login"?await api.post("/login",data):await api.post("/signup",data)
    return res
}

export const addUserAddress=async(data:userDetails)=>
{
    const res=await api.post("/addUserDet",
        {
            userData:data,
            userDet:localStorage.getItem("user-storage")

        }
    )
    return res
}