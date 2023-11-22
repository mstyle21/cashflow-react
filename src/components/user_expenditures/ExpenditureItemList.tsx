import { Box, Typography } from "@mui/material";
import { Dispatch, useContext, useState } from "react";
import { FloatingLabel } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faPlusCircle, faSave, faTrashAlt, faWarning } from "@fortawesome/free-solid-svg-icons";
import { randomHash } from "../../utils";
import { isNumber } from "chart.js/helpers";
import ProductAutocomplete from "./ProductAutocomplete";
import ReactSelect, { SingleValue } from "react-select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner";
import { ExpenditureListItem, ELReducerAction, TApiCategory } from "../../types";
import { BACKEND_URL, CURRENCY_SIGN } from "../../config";

type ExpenditureItemListProps = {
  totalPrice: number | "";
  expenditureList: ExpenditureListItem[];
  dispatch: Dispatch<ELReducerAction>;
};

const ExpenditureItemList = ({ totalPrice, expenditureList, dispatch }: ExpenditureItemListProps) => {
  const [hash, setHash] = useState(randomHash());
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [pricePerUnit, setPricePerUnit] = useState<number | "">("");
  const [category, setCategory] = useState<number | "">("");
  const [action, setAction] = useState<"add_item" | "edit_item">("add_item");

  const { user } = useContext(AuthContext);

  const {
    isLoading: loadingCategories,
    error: errorCategories,
    data: categoryData,
  } = useQuery(
    ["categories"],
    async () => {
      try {
        const response = await axios.get<TApiCategory[]>(`${BACKEND_URL}/api/categories/?organized=true`, {
          headers: { "x-access-token": user?.token ?? "missing-token" },
        });

        return response.data ?? [];
      } catch (error) {
        console.error(error);
      }

      return [];
    },
    {
      staleTime: 300000,
    }
  );

  if (loadingCategories) return <LoadingSpinner />;
  if (errorCategories) return <div className="alert alert-danger">Something went wrong</div>;

  const selectedCategory = categoryData ? categoryData.find((item) => item.id === category) : null;

  const handleSaveItem = () => {
    if (itemName !== "" && isNumber(quantity) && quantity !== 0 && isNumber(pricePerUnit) && isNumber(category)) {
      dispatch({
        type: action,
        payload: {
          hash: hash,
          name: itemName,
          quantity: quantity,
          pricePerUnit: pricePerUnit,
          category: category,
        },
      });

      //reset states
      setHash(randomHash());
      setItemName("");
      setQuantity("");
      setPricePerUnit("");
      setCategory("");
      setAction("add_item");
    }
  };
  const handleDeleteItem = (e: React.MouseEvent, expenditureItem: ExpenditureListItem) => {
    e.stopPropagation();

    dispatch({
      type: "delete_item",
      payload: {
        hash: expenditureItem.hash,
        name: expenditureItem.name,
        quantity: expenditureItem.quantity,
        pricePerUnit: expenditureItem.pricePerUnit,
        category: expenditureItem.category,
      },
    });
  };

  let itemsPrice = 0;
  return (
    <Box
      borderLeft="2px solid lightgrey"
      borderRight="2px solid lightgrey"
      padding="0 20px"
      display="flex"
      flexDirection="column"
      gap="10px"
      sx={{ overflowY: "auto" }}
    >
      <Typography textAlign="center" fontWeight="bold" fontSize="24px">
        Item list
      </Typography>
      <Box display="flex" flexDirection="column" flexGrow="1" sx={{ overflowY: "auto" }}>
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="10px" m="10px 0">
          <ProductAutocomplete itemName={itemName} setItemName={setItemName} />
          <FloatingLabel label="Quantity">
            <Form.Control
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            ></Form.Control>
          </FloatingLabel>
          <FloatingLabel label="Price per unit">
            <Form.Control
              type="number"
              placeholder="Price per unit"
              value={isNumber(pricePerUnit) ? pricePerUnit / 100 : pricePerUnit}
              onChange={(e) => setPricePerUnit(parseFloat(e.target.value) * 100)}
            ></Form.Control>
          </FloatingLabel>
          <ReactSelect
            placeholder="Category"
            styles={{
              indicatorSeparator: (styles) => ({
                ...styles,
                display: "none",
              }),
              control: (styles) => ({
                ...styles,
                height: "100%",
              }),
              placeholder: (styles) => ({
                ...styles,
                color: "#212529",
              }),
            }}
            options={categoryData?.map((categoryDetails) => ({
              label: categoryDetails.name,
              options: categoryDetails.childs.map((child) => ({
                label: child.name,
                value: child.id,
              })),
            }))}
            value={category !== "" ? { label: selectedCategory?.name, value: category } : null}
            onChange={(
              newValue: SingleValue<{
                label: string | undefined;
                value: number;
              }>
            ) => {
              setCategory(newValue?.value ?? "");
            }}
          ></ReactSelect>
        </Box>
        {itemName &&
          itemName !== "" &&
          isNumber(quantity) &&
          quantity !== 0 &&
          isNumber(pricePerUnit) &&
          isNumber(category) && (
            <Box display="grid" gridTemplateColumns="1fr 80px 150px 150px 1fr 30px" alignItems="center" m="10px 0">
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography fontWeight="bold">Name</Typography>
                <Typography>{itemName}</Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography fontWeight="bold">Quantity</Typography>
                <Typography>{quantity}</Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography fontWeight="bold">Price / unit</Typography>
                <Typography>
                  {pricePerUnit / 100} {CURRENCY_SIGN}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography fontWeight="bold">Total price</Typography>
                <Typography>
                  {(quantity * pricePerUnit) / 100} {CURRENCY_SIGN}
                </Typography>
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                <Typography fontWeight="bold">Category</Typography>
                <Typography>{selectedCategory?.name}</Typography>
              </Box>
              <FontAwesomeIcon
                icon={action === "add_item" ? faPlusCircle : faSave}
                fontSize="30px"
                color="#8989ff"
                cursor="pointer"
                onClick={() => handleSaveItem()}
              />
            </Box>
          )}
        {expenditureList.length !== 0 && (
          <>
            <Box sx={{ overflowY: "auto" }} mt="10px">
              {expenditureList.map((expenditureItem, index) => {
                itemsPrice += expenditureItem.quantity * expenditureItem.pricePerUnit;
                return (
                  <div
                    className="expenditure-item"
                    key={index}
                    onClick={() => {
                      setHash(expenditureItem.hash);
                      setItemName(expenditureItem.name);
                      setQuantity(expenditureItem.quantity);
                      setPricePerUnit(expenditureItem.pricePerUnit);
                      setCategory(expenditureItem.category);
                      setAction("edit_item");
                    }}
                  >
                    <span className="expenditure-item-name">{expenditureItem.name}</span>
                    <span className="expenditure-item-quantity">{expenditureItem.quantity}</span>
                    <span className="expenditure-item-cross">x</span>
                    <span className="expenditure-item-ppu">
                      {expenditureItem.pricePerUnit / 100} {CURRENCY_SIGN}
                    </span>
                    <span className="expenditure-item-total">
                      {(expenditureItem.quantity * expenditureItem.pricePerUnit) / 100} {CURRENCY_SIGN}
                    </span>
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="expenditure-item-delete"
                      onClick={(e) => handleDeleteItem(e, expenditureItem)}
                    />
                  </div>
                );
              })}
            </Box>
            <Box display="flex" justifyContent="space-between" mt="10px">
              <span style={{ fontWeight: "bold" }}>Nr. items {expenditureList.length}</span>
              <span style={{ fontWeight: "bold" }}>
                Items price: {itemsPrice / 100} {CURRENCY_SIGN}{" "}
                {isNumber(totalPrice) && totalPrice === itemsPrice ? (
                  <FontAwesomeIcon icon={faCircleCheck} color="green" fontSize="20px" />
                ) : (
                  <FontAwesomeIcon icon={faWarning} color="orange" fontSize="20px" />
                )}
              </span>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ExpenditureItemList;
