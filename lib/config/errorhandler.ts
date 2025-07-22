import { AxiosError } from "axios";

type ServerError = {
  message?: string;
  errors?: Record<string, any>;
};

export const getAxiosError = (error: unknown): ServerError => {
  const axiosError = error as AxiosError<ServerError>;

  return {
    message: axiosError.response?.data?.message ?? "Something went wrong",
    errors: axiosError.response?.data?.errors ?? {},
  };
};
