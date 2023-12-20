import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";
import { TApiCategory } from "../types";

const getUserCategories = async () => {
  return axiosInstance.get<TApiCategory[]>("/api/categories").then((response) => response.data);
};

type UseUserCategoriesProps = {
  config?: QueryClientConfig;
};

export const useUserCategories = ({ config }: UseUserCategoriesProps) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user-categories"],
    queryFn: () => getUserCategories(),
    staleTime: 5 * 60 * 1000,
    ...config,
  });

  const categories = data ?? [];

  return { categories, error, isLoading };
};
