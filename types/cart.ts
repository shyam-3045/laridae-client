import { Product } from "./product"

export type orginalCart={
    product_id:string,
    products:Product | undefined,
    quantity:number
}