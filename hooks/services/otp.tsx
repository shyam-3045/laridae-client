import api from "@/lib/config/axios";

export const sendOtp = async (phone:string) => {
  const res = await api.post("/send-otp", {
    phone,
  });
  return res.data
};

export const verifyOtp=async(phone:string,otp:string)=>{
    const res= await api.post("/verify-otp",{
        phone,
        otp
    })
    return res.data
}