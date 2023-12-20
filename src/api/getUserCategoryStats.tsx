import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";
import { ApiExpenditureItem, UserStatsFilters } from "../types";

type UserCategoryStatsFilters = UserStatsFilters & {
  category: number;
};

const getUserCategoryStats = async ({ month, year, type, category }: UserCategoryStatsFilters) => {
  return axiosInstance
    .get<ApiExpenditureItem[]>(`/api/categories/stats?month=${month}&year=${year}&type=${type}&category=${category}`)
    .then((response) => response.data);
};

type UseUserCategoryStatsProps = UserCategoryStatsFilters & {
  config?: QueryClientConfig;
};

export const useUserCategoryStats = ({ month, year, type, category, config }: UseUserCategoryStatsProps) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user-expenditure", "user-category-stats", month, year, type, category],
    queryFn: () => getUserCategoryStats({ month, year, type, category }),
    staleTime: 5 * 60 * 1000,
    ...config,
  });

  const categoryStats = data ?? [];

  return { categoryStats, error, isLoading };
};
