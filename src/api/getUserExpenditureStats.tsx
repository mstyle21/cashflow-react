import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";
import { ApiExpenditure, UserStatsFilters } from "../types";

const getUserExpenditureStats = async ({ month, year, type }: UserStatsFilters) => {
  return axiosInstance
    .get<ApiExpenditure[]>(`/api/expenditures/stats?month=${month}&year=${year}&type=${type}`)
    .then((response) => response.data);
};

type UseUserExpenditureStats = UserStatsFilters & {
  config?: QueryClientConfig;
};

export const useUserExpenditureStats = ({ month, year, type, config }: UseUserExpenditureStats) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user-expenditures", "user-expenditure-stats", month, year, type],
    queryFn: () => getUserExpenditureStats({ month, year, type }),
    staleTime: 5 * 60 * 1000,
    ...config,
  });

  const expenditureStats = data ?? [];

  return { expenditureStats, error, isLoading };
};
