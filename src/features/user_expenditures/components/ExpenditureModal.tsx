import { useEffect, useReducer, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ExpenditureGeneralDetails from "./ExpenditureGeneralDetails";
import ExpenditureImageUpload from "./ExpenditureImageUpload";
import ExpenditureItemList from "./ExpenditureItemList";
import { TExpenditureDetails, TEditableExpenditure } from "../../../types";
import { BACKEND_URL } from "../../../config";
import { axiosInstance } from "../../../services/AxiosService";
import { expenditureListReducer, expenditureImagesReducer } from "../../../reducers/expenditureReducer";

const initialItem: TExpenditureDetails = {
  date: new Date(),
  totalPrice: "",
  company: null,
  location: null,
  settlement: "none",
};

type ExpenditureModalProps = {
  show: boolean;
  itemToEdit: TEditableExpenditure | null;
  closeModal: () => void;
};

const ExpenditureModal = ({ show, closeModal, itemToEdit }: ExpenditureModalProps) => {
  const [error, setError] = useState(false);
  const [expenditureDetails, setExpenditureDetails] = useState<TExpenditureDetails>(initialItem);
  const [expenditureList, dispatchList] = useReducer(expenditureListReducer, []);
  const [expenditureImages, dispatchImages] = useReducer(expenditureImagesReducer, []);

  useEffect(() => {
    if (itemToEdit) {
      setExpenditureDetails(itemToEdit.generalDetails);
      dispatchList({ type: "reset" });
      dispatchList({ type: "add_items", payload: itemToEdit.items });
      dispatchImages({ type: "reset" });
      dispatchImages({ type: "add_items", payload: itemToEdit.images });
    } else {
      setExpenditureDetails(initialItem);
      dispatchList({ type: "reset" });
      dispatchImages({ type: "reset" });
    }
  }, [itemToEdit]);

  const handleCloseModal = () => {
    closeModal();
    resetModal();
  };
  const resetModal = () => {
    setError(false);
    setExpenditureDetails(initialItem);
    dispatchList({ type: "reset" });
    dispatchImages({ type: "reset" });
  };
  const handleSaveExpenditure = () => {
    if (!expenditureDetails.date || !expenditureDetails.totalPrice || !expenditureDetails.company) {
      setError(true);
      return false;
    }

    const formData = new FormData();
    formData.append("date", expenditureDetails.date.toString());
    formData.append("totalPrice", expenditureDetails.totalPrice.toString());
    formData.append("company", expenditureDetails.company);
    formData.append("location", expenditureDetails.location?.toString() ?? "1");
    formData.append("settlement", expenditureDetails.settlement);
    formData.append("items", JSON.stringify(expenditureList));
    for (let i = 0; i < expenditureImages.length; i++) {
      const file = expenditureImages[i].file;
      if (file !== undefined) {
        formData.append("images", file, file.name);
      }
    }

    axiosInstance
      .request({
        url: `${BACKEND_URL}/api/expenditures/${itemToEdit ? itemToEdit.id : ""}`,
        method: itemToEdit ? "put" : "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.status === 201) {
          resetModal();
          closeModal();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Modal show={show} onHide={closeModal} dialogClassName="modal-fullscreen">
      <Modal.Header closeButton onHide={handleCloseModal}>
        <Modal.Title>{itemToEdit ? "Edit" : "Add new"} expenditure</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr 1fr",
          gap: "20px",
        }}
      >
        <ExpenditureGeneralDetails
          error={error}
          expenditureDetails={expenditureDetails}
          setExpenditureDetails={setExpenditureDetails}
        />
        <ExpenditureItemList
          totalPrice={expenditureDetails.totalPrice}
          expenditureList={expenditureList}
          dispatch={dispatchList}
        />
        <ExpenditureImageUpload images={expenditureImages} dispatch={dispatchImages} />
      </Modal.Body>
      <Modal.Footer style={{ display: "flex", justifyContent: "space-between" }}>
        <Button variant="primary" onClick={handleSaveExpenditure}>
          Save
        </Button>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExpenditureModal;
