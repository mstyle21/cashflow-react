import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";

const getUserCategoryStats = async (filters: string) => {
  return axiosInstance.get(`/api/categories/stats?${filters}`).then((response) => response.data);
};

type UseUserCategoryStatsProps = {
  filters: string;
  config?: QueryClientConfig;
};

export const useUserCategoryStats = ({ filters, config }: UseUserCategoryStatsProps) => {
  return useQuery({
    queryKey: ["user-expenditure", "user-category-stats"],
    queryFn: () => getUserCategoryStats(filters),
    staleTime: 5 * 60 * 1000,
    ...config,
  });
};
