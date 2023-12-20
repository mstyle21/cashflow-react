import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";
import { ApiCity } from "../types";

const getAllCities = async () => {
  return axiosInstance.get<ApiCity[]>("/api/cities").then((response) => response.data);
};

type UseAllCitiesProps = {
  config?: QueryClientConfig;
};

export const useAllCities = ({ config }: UseAllCitiesProps) => {
  return useQuery({
    queryKey: ["cities"],
    queryFn: () => getAllCities(),
    staleTime: 5 * 60 * 1000,
    ...config,
  });
};
