import { useContext, useState } from "react";
import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { TApiCategory } from "../../pages/Category";
import { BACKEND_URL } from "../../helpers/utils";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

type CategoryModalProps = {
  showModal: boolean;
  itemToEdit: TApiCategory | null;
  parentCategories: TApiCategory[];
  closeModal: (refreshList?: boolean) => void;
};

const CategoryModal = ({ showModal, itemToEdit, parentCategories, closeModal }: CategoryModalProps) => {
  const [name, setName] = useState(itemToEdit?.name ?? "");
  const [parentId, setParentId] = useState(itemToEdit?.parent?.id ?? 0);

  const { user } = useContext(AuthContext);

  const handleSaveCategory = () => {
    if (itemToEdit) {
      //edit
      axios
        .put(
          `${BACKEND_URL}/api/categories/${itemToEdit.id}`,
          { name, parentId },
          {
            headers: { "x-access-token": user?.token ?? "missing-token" },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            closeModal(true);
          }
        })
        .catch((error) => console.error(error));
    } else {
      //create
      axios
        .post(
          `${BACKEND_URL}/api/categories`,
          { name, parentId },
          {
            headers: { "x-access-token": user?.token ?? "missing-token" },
          }
        )
        .then((response) => {
          if (response.status === 201) {
            closeModal(true);
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton onHide={closeModal}>
        <Modal.Title>{itemToEdit ? "Edit" : "Add new"} category</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <FloatingLabel label="Category name">
          <Form.Control
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </FloatingLabel>
        <FloatingLabel label="Parent category">
          <Form.Select value={parentId} onChange={(e) => setParentId(parseInt(e.target.value))}>
            <option value={0}>No parent</option>
            {parentCategories.map((parentCategory) => (
              <option key={parentCategory.id} value={parentCategory.id}>
                {parentCategory.name}
              </option>
            ))}
          </Form.Select>
        </FloatingLabel>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSaveCategory}>
          Save
        </Button>
        <Button variant="secondary" onClick={() => closeModal()}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;
