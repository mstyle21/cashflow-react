import { QueryClientConfig, useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";
import { ApiPaginatedResponse, ApiProduct } from "../types";

type ProductFilters = {
  search: string;
  page: number;
  perPage: number;
};

const getProducts = async ({ search, page, perPage }: ProductFilters) => {
  return axiosInstance
    .get<ApiPaginatedResponse<ApiProduct>>(`/api/products?search=${search}&page=${page}&perPage=${perPage}`)
    .then((response) => response.data);
};

type UseProductsProps = ProductFilters & {
  config?: QueryClientConfig;
};

export const useProducts = ({ search, page, perPage, config }: UseProductsProps) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["user-products", search, page, perPage],
    queryFn: () => getProducts({ search, page, perPage }),
    staleTime: 5 * 60 * 1000,
    ...config,
  });

  const products = data?.items ?? [];
  const count = data?.count ?? 0;
  const pages = data?.pages ?? 1;

  return { products, count, pages, error, isLoading };
};
