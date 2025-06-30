"use client";

import { QueryClient,QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { children } from "@/types/common";

export default function ReactQuery({children}:children){
    const [queryClient]=useState(()=> new QueryClient({
        defaultOptions:{
            queries:{
                staleTime:1000*60*5,
                refetchOnWindowFocus:false,
            }
        }
    }))

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false}/>

        </QueryClientProvider>
    )
}