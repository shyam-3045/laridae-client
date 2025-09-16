import React from 'react'
import { HydrationBoundary,dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/utils/queryClient'
import { getAllProducts } from '@/hooks/services/getAllProducts'
import ShopPage from '@/components/layouts/ShopPage'


const Shop = async () => {
  const shopFlag=2

    
  const queryClient=getQueryClient()
  await queryClient.prefetchQuery({
    queryKey:["Products"],
    queryFn:getAllProducts
  })

  const dehydrateState=dehydrate(queryClient)


  return (
    
    <HydrationBoundary state={dehydrateState}>
      <ShopPage shopFlag={shopFlag}/>
    </HydrationBoundary>
    
    
  )
}

export default Shop