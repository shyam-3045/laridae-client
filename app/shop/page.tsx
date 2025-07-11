import React from 'react'
import { HydrationBoundary,dehydrate } from '@tanstack/react-query'
import getQueryClient from '@/utils/queryClient'
import { getAllProducts } from '@/hooks/services/getAllProducts'
import ShopPage from '@/components/layouts/ShopPage'
//import AnimatedOnScroll from '@/components/common/AddScrollAnimations'

const Shop = async () => {
  const queryClient=getQueryClient()
  await queryClient.prefetchQuery({
    queryKey:["Products"],
    queryFn:getAllProducts
  })

  const dehydrateState=dehydrate(queryClient)


  return (
    
    <HydrationBoundary state={dehydrateState}>
      <ShopPage/>
    </HydrationBoundary>
    
    
  )
}

export default Shop