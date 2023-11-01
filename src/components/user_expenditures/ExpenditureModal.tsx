import React, { SetStateAction, useContext, useEffect, useReducer, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ExpenditureGeneralDetails from "./ExpenditureGeneralDetails";
import ExpenditureImageUpload from "./ExpenditureImageUpload";
import ExpenditureItemList from "./ExpenditureItemList";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { TEditableExpenditure } from "../../pages/Expenditure";
import { CONFIG } from "../../config";

export type TExpenditureDetails = {
  date: Date | null;
  totalPrice: number | "";
  company: string | null;
  location: number | null;
  settlement: "none" | "total" | "partial";
};

export type ExpenditureListItem = {
  hash: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  category: number;
};
export type ELReducerAction =
  | {
      type: "add_item" | "edit_item" | "delete_item";
      payload: ExpenditureListItem;
    }
  | { type: "reset" }
  | { type: "add_items"; payload: ExpenditureListItem[] };
function expenditureListReducer(state: ExpenditureListItem[], action: ELReducerAction) {
  switch (action.type) {
    case "add_item":
      return [...state, action.payload];
    case "edit_item":
      if (state.find((item) => item.hash === action.payload.hash)) {
        return state.map((item) => {
          return item.hash === action.payload.hash ? action.payload : item;
        });
      } else {
        return [...state, action.payload];
      }
    case "delete_item":
      return state.filter((item) => item.hash !== action.payload.hash);
    case "reset":
      return [];
    case "add_items":
      return [...state, ...action.payload];
    default:
      return state;
  }
}

export type TExpenditureImage = {
  hash: string;
  path: string;
  expenditureId?: number;
  file?: File;
};
export type EIReducerAction =
  | {
      type: "add_item";
      payload: TExpenditureImage | TExpenditureImage[];
    }
  | {
      type: "delete_item";
      payload: TExpenditureImage;
    }
  | { type: "reset" }
  | { type: "add_items"; payload: TExpenditureImage[] };

function expenditureImagesReducer(state: TExpenditureImage[], action: EIReducerAction) {
  switch (action.type) {
    case "add_item":
      if (Array.isArray(action.payload)) {
        return [...state, ...action.payload];
      } else {
        return [...state, action.payload];
      }
    case "delete_item":
      return state.filter((item) => item.hash !== action.payload.hash);
    case "reset":
      return [];
    case "add_items":
      return [...state, ...action.payload];
    default:
      return state;
  }
}

const initialItem: TExpenditureDetails = {
  date: new Date(),
  totalPrice: "",
  company: null,
  location: null,
  settlement: "none",
};

type ExpenditureModalProps = {
  show: boolean;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  closeModalAndRefresh: () => void;
  itemToEdit: TEditableExpenditure | null;
};

const ExpenditureModal = ({ show, setShow, closeModalAndRefresh, itemToEdit }: ExpenditureModalProps) => {
  const [error, setError] = useState(false);
  const [expenditureDetails, setExpenditureDetails] = useState<TExpenditureDetails>(initialItem);
  const [expenditureList, dispatchList] = useReducer(expenditureListReducer, []);
  const [expenditureImages, dispatchImages] = useReducer(expenditureImagesReducer, []);

  const { user } = useContext(AuthContext);

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
    setShow(false);
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

    if (itemToEdit) {
      //edit
      axios
        .put(`${CONFIG.backendUrl}/api/expenditures/${itemToEdit.id}`, formData, {
          headers: { "x-access-token": user?.token ?? "missing-token" },
        })
        .then((response) => {
          if (response.status === 201) {
            resetModal();
            closeModalAndRefresh();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      //create
      axios
        .post(`${CONFIG.backendUrl}/api/expenditures`, formData, {
          headers: { "x-access-token": user?.token ?? "missing-token" },
        })
        .then((response) => {
          if (response.status === 201) {
            resetModal();
            closeModalAndRefresh();
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-fullscreen">
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
