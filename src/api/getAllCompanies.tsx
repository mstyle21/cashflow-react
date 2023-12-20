import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";
import { ApiCompany } from "../types";

const getAllCompanies = async () => {
  return axiosInstance.get<ApiCompany[]>("/api/companies").then((response) => response.data);
};

type UseAllCompaniesProps = {
  config?: QueryClientConfig;
};

export const useAllCompanies = ({ config }: UseAllCompaniesProps) => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => getAllCompanies(),
    staleTime: 5 * 60 * 1000,
    ...config,
  });
};
