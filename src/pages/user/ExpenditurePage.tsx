import { Box, Typography } from "@mui/material";
import PageTitle from "../../layouts/user/PageTitle";
import YearFilter from "../../components/filters/YearFilter";
import MonthFilter from "../../components/filters/MonthFilter";
import { CURRENT_MONTH, CURRENT_YEAR } from "../../utils";
import LoadingSpinner from "../../components/LoadingSpinner";
import { isArray } from "chart.js/helpers";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { ApiExpenditure, TEditableExpenditure } from "../../types";
import { CURRENCY_SIGN } from "../../config";
import ExpenditureList from "../../features/user_expenditures/components/ExpenditureList";
import ExpenditureModal from "../../features/user_expenditures/components/ExpenditureModal";
import { useExpenditures } from "../../api/getUserExpenditures";

const ExpenditurePage = () => {
  const [month, setMonth] = useState(CURRENT_MONTH);
  const [year, setYear] = useState(CURRENT_YEAR.toString());
  const [modalShow, setModalShow] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<TEditableExpenditure | null>(null);

  const handleMonthChange = (month: string) => {
    if (month) setMonth(month);
  };
  const handleYearChange = (year: string) => {
    if (year) setYear(year);
  };

  const { data, isLoading, error } = useExpenditures({ month, year });

  let paidValue = 0;
  if (data && isArray(data)) {
    const paidValues = data.map((expenditure) => {
      return expenditure && expenditure.totalPrice ? expenditure.totalPrice : 0;
    });
    paidValue = paidValues.reduce((a, b) => a + b, 0);
  }

  const handleAddExpenditure = () => {
    setModalShow(true);
    setItemToEdit(null);
  };

  const handleEditExpenditure = (expenditure: ApiExpenditure) => {
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

  const handleCloseModal = () => {
    setModalShow(false);
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
          Total paid: {paidValue / 100} {CURRENCY_SIGN}
        </Typography>
        <Box justifySelf="end">
          <Button id="addNewExpenditure" onClick={handleAddExpenditure}>
            Add new expenditure
          </Button>
        </Box>
      </Box>
      {error && <div className="alert alert-danger">Something went wrong.</div>}
      {isLoading && <LoadingSpinner />}
      {data && <ExpenditureList expenditures={data} openModal={handleEditExpenditure} />}
      <ExpenditureModal show={modalShow} closeModal={handleCloseModal} itemToEdit={itemToEdit} />
    </div>
  );
};

export default ExpenditurePage;
