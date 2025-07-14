import { shopFlag } from '@/types/common'
import {create} from 'zustand'
import { persist } from 'zustand/middleware'



export const useShopFlag=create<shopFlag>()(
    persist(
        (set)=>
        (
            {
                shopFlag:1,
                updateShopFlag:(flagValue:number)=>{
                    set({shopFlag:flagValue})
                }
            }
        ),{
            name:'Shop-Flag'
        }
    )
)