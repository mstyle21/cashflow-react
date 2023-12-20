import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";

const getUserExpenditureStats = async (filters: string) => {
  return axiosInstance.get(`/api/expenditures/stats?${filters}`).then((response) => response.data);
};

type UseUserExpenditureStats = {
  filters: string;
  config?: QueryClientConfig;
};

export const useUserExpenditureStats = ({ filters, config }: UseUserExpenditureStats) => {
  return useQuery({
    queryKey: ["user-expenditure", "user-expenditure-stats"],
    queryFn: () => getUserExpenditureStats(filters),
    staleTime: 5 * 60 * 1000,
    ...config,
  });
};
