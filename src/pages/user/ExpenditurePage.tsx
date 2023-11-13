import { Box, Typography } from "@mui/material";
import ExpenditureList, { TApiExpenditure } from "../../components/user_expenditures/ExpenditureList";
import PageTitle from "../../layouts/user/PageTitle";
import YearFilter from "../../components/filters/YearFilter";
import MonthFilter from "../../components/filters/MonthFilter";
import { CURRENT_MONTH, CURRENT_YEAR, randomHash } from "../../utils/utils";
import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../../components/LoadingSpinner";
import { isArray } from "chart.js/helpers";
import ExpenditureModal, {
  ExpenditureListItem,
  TExpenditureDetails,
  TExpenditureImage,
} from "../../components/user_expenditures/ExpenditureModal";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { CONFIG } from "../../config";

export type TEditableExpenditure = {
  id: number;
  generalDetails: TExpenditureDetails;
  items: ExpenditureListItem[];
  images: TExpenditureImage[];
};

const ExpenditurePage = () => {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year, setYear] = useState(CURRENT_YEAR.toString());
  const [modalShow, setModalShow] = useState(false);
  const [refreshHash, setRefreshHash] = useState(randomHash());
  const [itemToEdit, setItemToEdit] = useState<TEditableExpenditure | null>(null);

  const handleMonthChange = (month: string) => {
    if (month) setMonth(month);
  };
  const handleYearChange = (year: string) => {
    if (year) setYear(year);
  };

  const API_URL = `${CONFIG.backendUrl}/api/expenditures?month=${month}&year=${year}&${refreshHash}`;

  const { data, isLoading, error } = useFetch<TApiExpenditure[]>(API_URL);

  let paidValue = 0;
  if (data && isArray(data)) {
    const typedData = data;
    const paidValues = typedData.map((expenditure) => {
      return expenditure && expenditure.totalPrice ? expenditure.totalPrice : 0;
    });
    paidValue = paidValues.reduce((a, b) => a + b, 0);
  }

  const handleAddExpenditure = () => {
    setModalShow(true);
    setItemToEdit(null);
  };
  const handleEditExpenditure = (expenditure: TApiExpenditure) => {
    setModalShow(true);
    setItemToEdit({
      id: expenditure.id,
      generalDetails: {
        date: new Date(expenditure.purchaseDate),
        totalPrice: expenditure.totalPrice,
        company: expenditure.company.name,
        location: 1,
        settlement: "none",
      },
      items: expenditure.items.map((expenditureItem) => {
        return {
          hash: expenditureItem.id.toString(),
          name: expenditureItem.product.name,
          quantity: expenditureItem.quantity,
          pricePerUnit: expenditureItem.pricePerUnit,
          category: expenditureItem.category.id,
        };
      }),
      images: expenditure.images.map((expenditureImage) => {
        return {
          hash: expenditureImage.id.toString(),
          path: expenditureImage.path,
          expenditureId: expenditure.id,
        };
      }),
    });
  };

  const handleCloseModalAndRefresh = () => {
    setModalShow(false);
    setRefreshHash(randomHash());
  };

  return (
    <div className="page-wrapper">
      <PageTitle title="Expenditure list" />
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        justifyContent="space-between"
        alignItems="center"
        mb="20px"
      >
        <Box display="flex" gap="20px">
          <YearFilter onChange={handleYearChange} />
          <MonthFilter onChange={handleMonthChange} />
        </Box>
        <Typography fontWeight="bold" fontSize="24px" justifySelf="center">
          Total paid: {paidValue / 100} {CONFIG.currency}
        </Typography>
        <Box justifySelf="end">
          <Button id="addNewExpenditure" onClick={handleAddExpenditure}>
            Add new expenditure
          </Button>
        </Box>
      </Box>
      {error && <div className="alert alert-danger">{error}</div>}
      {isLoading && <LoadingSpinner />}
      {data && <ExpenditureList expenditures={data} openModal={handleEditExpenditure} />}
      <ExpenditureModal
        show={modalShow}
        setShow={setModalShow}
        closeModalAndRefresh={handleCloseModalAndRefresh}
        itemToEdit={itemToEdit}
      />
    </div>
  );
};

export default ExpenditurePage;
