import api from "@/lib/config/axios"

const getAllProducts=async()=>
{
    const res=await api.get("/getProducts")
    return res.data
}

export{getAllProducts}