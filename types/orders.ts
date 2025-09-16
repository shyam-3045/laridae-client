import { DeliveryFormData } from "@/app/payment/page"

interface payment {
    razorpay_order_id:string,
    razorpay_payment_id:string,
    razorpay_signature:string
}

interface orderProducts{
    product_id:string,
    quantity:number
}
export interface orderSchema{
    email:string,
    products:orderProducts[],
    deliveryDetails?:DeliveryFormData,
    totalAmount:number,
    paymentDetails:payment
}