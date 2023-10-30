import { Box } from "@mui/material";
import { TApiCategory } from "../../pages/Category";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { BACKEND_URL } from "../../helpers/utils";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

type CategoryListProps = {
  categories: TApiCategory[];
  editCategory: (category: TApiCategory) => void;
  refreshList: () => void;
};

const CategoryList = ({ categories, editCategory, refreshList }: CategoryListProps) => {
  const { user } = useContext(AuthContext);

  const handleDeleteCategory = (category: TApiCategory) => {
    if (confirm(`Are you sure you want to delete category: ${category.name} ?`)) {
      axios
        .delete(`${BACKEND_URL}/api/categories/${category.id}`, {
          headers: { "x-access-token": user?.token ?? "missing-token" },
        })
        .then((response) => {
          if (response.status === 204) {
            refreshList();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  return (
    <Box display="grid" gridTemplateColumns="repeat(4, minmax(250px, 1fr))" gap="30px">
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
                            onClick={() => editCategory({ ...childCategory, parent: category })}
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
  );
};

export default CategoryList;
