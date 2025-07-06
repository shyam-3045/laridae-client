'use client';

import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../services/getAllProducts";

export function useAllProducts(){
    return useQuery({
        queryKey:["Products"],
        queryFn:getAllProducts
    })
}