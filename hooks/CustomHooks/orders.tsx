import { useMutation,useQuery } from "@tanstack/react-query";
import { createOrder, getOrders } from "../services/orders";
import { orderSchema } from "@/types/orders";
import getQueryClient from "@/utils/queryClient";


export const getMyOrders=()=>
{
    return useQuery({
        queryKey:["getOrders"],
        queryFn:()=>getOrders()
    })
}

export const createOrd=()=>
{
    const queryClient = getQueryClient();
    return useMutation({
        
        mutationFn:(payload:orderSchema)=>
            createOrder(payload),
        onSuccess:()=>{
            queryClient.invalidateQueries({ queryKey: ["getOrders"] }),
            console.log("success")
        },
        
    onError:(error)=>
      console.log(error)

    })
}