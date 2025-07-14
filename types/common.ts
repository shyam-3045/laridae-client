
export type children={
    children:React.ReactNode
}


export interface CartProps{
    product_id:string,
    quantity:number
}

export type shopFlag={
    shopFlag:number,
    updateShopFlag:(flagValue:number)=>void;
}