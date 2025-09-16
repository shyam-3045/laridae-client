import { Bounce, toast } from "react-toastify";

const baseConfig = {
  className: "toast-auto", // 👈 hook into CSS
  position: "top-center" as const,
  autoClose: 3500,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: false,
  draggable: true,
  progress: undefined,
  theme: "light" as const,
  transition: Bounce,
};

export function toastSuccess(msg: string) {
  toast.success(msg, baseConfig);
}

export function toastFailure(msg: string) {
  toast.error(msg, baseConfig);
}
