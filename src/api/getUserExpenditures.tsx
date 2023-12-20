import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";
import { ApiExpenditure } from "../types";

type ExpenditureFilters = {
  month: string;
  year: string;
};

const getExpenditures = async ({ month, year }: ExpenditureFilters) => {
  return axiosInstance
    .get<ApiExpenditure[]>(`/api/expenditures?month=${month}&year=${year}`)
    .then((response) => response.data);
};

type UseExpendituresProps = ExpenditureFilters & {
  config?: QueryClientConfig;
};

export const useExpenditures = ({ month, year, config }: UseExpendituresProps) => {
  return useQuery({
    queryKey: ["user-expenditures"],
    queryFn: () => getExpenditures({ month, year }),
    staleTime: 5 * 60 * 1000,
    ...config,
  });
};
