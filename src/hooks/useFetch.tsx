import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useFetch<T = unknown>(url: string, options?: RequestInit) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const { user, logout } = useContext(AuthContext);

  options = {
    ...options,
    headers: { "x-access-token": user?.token ?? "token-missing" },
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setData(null);

    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        await fetch(url, { ...options, signal: abortController.signal })
          .then((response) => response.json() as T)
          .then((data) => {
            setData(data);
            setIsLoading(false);
            setError(null);
          })
          .catch((error: TypeError) => {
            if (error.name === "AbortError") {
              // do nothing
            } else {
              if (error.message.includes("Token expired!")) {
                const redirectPath = window.location.pathname !== "/login" ? window.location.pathname : undefined;
                logout(redirectPath);
              }
              setIsLoading(false);
              setError("Oops! Something went wrong.");
            }
          });
      } catch (err) {
        console.error(err);
        setError("Oops! Something went wrong!");
      }
    };

    fetchData();

    return () => abortController.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return { data, isLoading, error };
}
