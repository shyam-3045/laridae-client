import api from "@/lib/config/axios";
import { loginFormData } from "@/types/common";
import { userDetails } from "@/types/userDetails";

export const Login = async (data: loginFormData, typeOfAuth: string) => {
  const res =
    typeOfAuth === "Login"
      ? await api.post("/login", data)
      : await api.post("/signup", data);
  return res;
};

export const addUserAddress = async (data: userDetails) => {
  const res = await api.post("/addUserDet", {
    userData: data,
    userDet: localStorage.getItem("user-storage"),
  });
  return res;
};

export const editUserDet = async (data: userDetails) => {
  const res = await api.post("/editUserDet", {
    userData: data,
    userDet: localStorage.getItem("user-storage"),
  });
  return res;
};

export const getUserDet = async () => {
  const res = await api.post("/getUserDet",{
    code: process.env.NEXT_PUBLIC_CODE,
    Userdata: localStorage.getItem("user-storage"),
  });
  return res
};
