import { useState, useEffect, useContext } from "react";
import { AxiosError } from "axios";
import { axiosInstance, setAccessToken } from "../services/AxiosService";
import { AuthContext } from "../context/AuthContext";

type AxiosProps = {
  url: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  body?: string | null;
  headers?: string | null;
};

type UseAxiosReturn<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  refreshData: () => void;
};

export default function useAxios<T = unknown>({ url, method, body = null }: AxiosProps): UseAxiosReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setloading] = useState(true);
  const [trigger, setTrigger] = useState(0);

  const { user, logout } = useContext(AuthContext);

  setAccessToken(user?.token ?? "");

  const refreshData = () => {
    setTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    setloading(true);
    const controller = new AbortController();

    axiosInstance({
      url: url,
      method: method,
      data: body,
      signal: controller.signal,
    })
      .then((res) => {
        setData(res.data);
        setError(null);
        setloading(false);
      })
      .catch((err: AxiosError) => {
        if (err.name === "CanceledError") {
          //nothing
        } else {
          setError(err.message);

          if (err.response?.status === 401 && err.response.data === "Token expired!") {
            logout();
          }

          setloading(false);
        }
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, url, body, trigger]);

  return { data, error, loading, refreshData };
}
