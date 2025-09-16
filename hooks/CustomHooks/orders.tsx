import { useMutation,useQuery } from "@tanstack/react-query";
import { createOrder, getOrders } from "../services/orders";
import { orderSchema } from "@/types/orders";


export const getMyOrders=()=>
{
    return useQuery({
        queryKey:["products"],
        queryFn:()=>getOrders()
    })
}

export const createOrd=()=>
{
    return useMutation({
        mutationFn:(payload:orderSchema)=>
            createOrder(payload),
        onSuccess:()=>
      console.log("success"),
    onError:(error)=>
      console.log(error)

    })
}