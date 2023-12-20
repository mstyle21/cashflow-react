import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";

type CategoryDetails = {
  id?: number;
  name: string;
  parentId: number | null;
};

const saveUserCategory = async (data: CategoryDetails) => {
  return axiosInstance.request({
    method: data.id ? "PUT" : "POST",
    url: `/api/categories/${data.id ? data.id : ""}`,
    data: data,
  });
};

export const useSaveUserCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-categories"] });
    },
  });
};
