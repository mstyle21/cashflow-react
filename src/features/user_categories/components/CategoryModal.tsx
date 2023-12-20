import { Button, FloatingLabel, Form, Modal } from "react-bootstrap";
import { ApiCategory } from "../../../types";
import { useSaveUserCategory } from "../../../api/saveUserCategory";
import { useCategory } from "../hooks/useCategory";

type CategoryModalProps = {
  showModal: boolean;
  itemToEdit: ApiCategory | null;
  parentCategories: ApiCategory[];
  closeModal: (refreshList?: boolean) => void;
};

const CategoryModal = ({ showModal, itemToEdit, parentCategories, closeModal }: CategoryModalProps) => {
  const { name, parentId, setName, setParentId, resetValues } = useCategory(itemToEdit);
  const saveUserCategory = useSaveUserCategory();

  const handleSaveCategory = () => {
    if (!name) {
      return false;
    }

    const data = {
      id: itemToEdit?.id,
      name: name,
      parentId: parentId,
    };

    saveUserCategory.mutate(data, {
      onSuccess: () => {
        resetValues();
        closeModal();
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header
        closeButton
        onHide={() => {
          closeModal();
          resetValues();
        }}
      >
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
        <Button
          variant="secondary"
          onClick={() => {
            closeModal();
            resetValues();
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CategoryModal;
