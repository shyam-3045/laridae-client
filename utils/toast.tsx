import { Bounce, toast } from "react-toastify";

export function toastSuccess(msg:string)
{
    toast.success(msg, {
position: "top-center",
autoClose: 3500,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: false,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
});
}
export function toastFailure(msg:string)
{
    toast.error(msg, {
position: "top-left",
autoClose: 3500,
hideProgressBar: false,
closeOnClick: false,
pauseOnHover: false,
draggable: true,
progress: undefined,
theme: "light",
transition: Bounce,
});
}