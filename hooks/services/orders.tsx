import api from "@/lib/config/axios"
import { orderSchema } from "@/types/orders"

export const getOrders=async()=>
{
    const user = JSON.parse(localStorage.getItem("user-storage") as string);
    const email=user.state.data.user
    const res = await api.post("/myOrder",{
        email:email
    })
    return res.data
}

export const createOrder=async(data:orderSchema)=>
{
    const res= await api.post("/createOrder",data)
    return res.data
}