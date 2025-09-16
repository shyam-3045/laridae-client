import api from "@/lib/config/axios";

export const sendOtp = async (email:string) => {
  const res = await api.post("/send-otp", {
    email,
  });
  return res.data
};

export const verifyOtp=async(email:string,otp:string)=>{
    const res= await api.post("/verify-otp",{
        email,
        otp
    })
    return res.data
}