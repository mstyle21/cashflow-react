import { Box } from "@mui/material";
import PageTitle from "../../layouts/user/PageTitle";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Button } from "react-bootstrap";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CategoryList from "../../components/user_categories/CategoryList";
import CategoryModal from "../../components/user_categories/CategoryModal";
import { TApiCategory } from "../../types";
import { BACKEND_URL } from "../../config";

const CategoryPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<TApiCategory | null>(null);

  const { user } = useContext(AuthContext);

  const queryClient = useQueryClient();
  const { isError, isLoading, data } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      let categories: TApiCategory[] = [];
      try {
        const response = await axios.get<TApiCategory[]>(`${BACKEND_URL}/api/categories?organized=true`, {
          headers: { "x-access-token": user?.token ?? "missing-token" },
        });
        categories = response.data;
      } catch (error) {
        console.error(error);
      }
      return categories;
    },
    staleTime: 300000,
  });

  const categories = data ?? [];

  const handleAddCategory = () => {
    setItemToEdit(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: TApiCategory) => {
    setItemToEdit(category);
    setShowModal(true);
  };

  const handleRefreshList = () => {
    queryClient.invalidateQueries(["categories"]);
  };

  const handleCloseModal = (refreshList: boolean = false) => {
    setShowModal(false);
    if (refreshList) {
      handleRefreshList();
    }
  };

  const parentCategories = categories.filter((category) => category.parent === null);

  return (
    <div className="page-wrapper">
      <PageTitle title="Categories" />
      <Box display="flex" justifyContent="end" alignItems="center" mb="20px">
        <Box justifySelf="end">
          <Button id="addNewCategory" onClick={handleAddCategory}>
            Add new category
          </Button>
        </Box>
      </Box>
      {isLoading && <LoadingSpinner />}
      {isError && <div className="alert alert-danger">Something went wrong. Please try again later</div>}
      <CategoryList categories={categories} editCategory={handleEditCategory} refreshList={handleRefreshList} />
      <CategoryModal
        key={itemToEdit?.id}
        showModal={showModal}
        itemToEdit={itemToEdit}
        parentCategories={parentCategories}
        closeModal={handleCloseModal}
      />
    </div>
  );
};

export default CategoryPage;
