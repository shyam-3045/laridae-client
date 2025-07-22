import { useMutation } from "@tanstack/react-query";
import { addUserAddress, Login } from "../services/auth";
import { loginFormData } from "@/types/common";
import { userDetails } from "@/types/userDetails";

export const loginOrSignUp = () => {
  return useMutation({
    mutationFn: (payload: { data: loginFormData; typeOfAuth: string }) =>
      Login(payload.data, payload.typeOfAuth),
    onSuccess:()=>
        console.log("success")
  })

};

export const addUserDetails =()=>
{
  return useMutation({
    mutationFn: (payload: { data: userDetails }) =>
      addUserAddress(payload.data),
    onSuccess:()=>
      console.log("success"),
    onError:(error)=>
      console.log(error)
  })
}
