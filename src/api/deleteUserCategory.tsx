import { useQueryClient, useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../services/AxiosService";

const deleteUserCategory = async (categoryId: number) => {
  return axiosInstance.request({
    method: "delete",
    url: `/api/categories/${categoryId}`,
  });
};

export const useDeleteUserCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-categories"] });
    },
  });
};
