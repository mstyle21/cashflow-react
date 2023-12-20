import { Box } from "@mui/material";
import { Accordion, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { ApiCategory } from "../../../types";
import { useUserCategories } from "../../../api/getUserCategories";
import CategoryModal from "./CategoryModal";
import { useState } from "react";
import { useDeleteUserCategory } from "../../../api/deleteUserCategory";
import LoadingSpinner from "../../../components/LoadingSpinner";

const CategoryList = () => {
  const [showModal, setShowModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<ApiCategory | null>(null);

  const { categories, error, isLoading } = useUserCategories({});
  const deleteUserCategory = useDeleteUserCategory();

  const handleDeleteCategory = (category: ApiCategory) => {
    if (confirm(`Are you sure you want to delete: ${category.name} ?`)) {
      deleteUserCategory.mutate(category.id);
    }
  };

  const handleOpenModal = (itemToEdit = null) => {
    setShowModal(true);
    setItemToEdit(itemToEdit);
  };

  const handleCloseModal = () => setShowModal(false);

  const parentCategories = categories.filter((category) => category.parent === null);

  return (
    <>
      <Box className="mb-3 d-flex justify-content-end">
        <Button onClick={() => handleOpenModal()}>Add new category</Button>
      </Box>
      <Box display="grid" gridTemplateColumns="repeat(4, minmax(250px, 1fr))" gap="30px">
        {!isLoading && error && <p className="alert alert-danger text-center">Something went wrong!</p>}
        {isLoading && <LoadingSpinner />}
        {categories.map((category) => {
          if (category.parent === null) {
            return (
              <Accordion key={category.id} defaultActiveKey={category.id.toString()} alwaysOpen>
                <Accordion.Item eventKey={category.id.toString()}>
                  <Accordion.Header>{category.name}</Accordion.Header>
                  <Accordion.Body>
                    {category.childs.map((childCategory) => {
                      return (
                        <Box key={childCategory.id} display={"flex"} justifyContent={"space-between"} p="10px 0">
                          {childCategory.name}
                          <Box display="flex" gap="10px">
                            <FontAwesomeIcon
                              icon={faEdit}
                              color="green"
                              fontSize="20px"
                              cursor="pointer"
                              onClick={() => {
                                setItemToEdit(childCategory);
                                setShowModal(true);
                              }}
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              color="red"
                              fontSize="20px"
                              cursor="pointer"
                              onClick={() => handleDeleteCategory(childCategory)}
                            />
                          </Box>
                        </Box>
                      );
                    })}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            );
          }
        })}
      </Box>
      <CategoryModal
        showModal={showModal}
        closeModal={handleCloseModal}
        itemToEdit={itemToEdit}
        parentCategories={parentCategories}
      />
    </>
  );
};

export default CategoryList;
