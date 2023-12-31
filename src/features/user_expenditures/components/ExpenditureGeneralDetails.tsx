import { Box, Typography } from "@mui/material";
import { SetStateAction } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import AsyncCreatableSelect from "react-select/async-creatable";
import ReactSelect from "react-select";
import { isNumber } from "chart.js/helpers";
import { TExpenditureDetails } from "../../../types";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useAllCompanies } from "../../../api/getAllCompanies";
import { useAllCities } from "../../../api/getAllCities";

const ExpenditureGeneralDetails = ({
  error,
  expenditureDetails,
  setExpenditureDetails,
}: {
  error: boolean;
  expenditureDetails: TExpenditureDetails;
  setExpenditureDetails: React.Dispatch<SetStateAction<TExpenditureDetails>>;
}) => {
  const { isLoading: loadingCities, error: errorCities, data: cityData } = useAllCities({});
  const { isLoading: loadingCompanies, error: errorCompanies, data: companies } = useAllCompanies({});

  if (loadingCities) return <LoadingSpinner />;
  if (errorCities) return <div className="alert alert-danger">Something went wrong!</div>;

  if (loadingCompanies) return <LoadingSpinner />;
  if (errorCompanies) return <div className="alert alert-danger">Something went wrong.</div>;

  let defaultCity = {};
  const cityOptions = cityData?.map((city) => {
    if (city.name.toLowerCase() === "oradea") {
      defaultCity = {
        value: city.id.toString(),
        label: city.name,
      };
    }

    return {
      value: city.id.toString(),
      label: city.name,
    };
  });

  const promiseOptions = async (inputValue: string) => {
    if (!companies) {
      return [];
    }
    const list = companies
      .filter((company) => {
        if (company.name.toLowerCase().includes(inputValue)) {
          return true;
        }
      })
      .map((company) => {
        return { label: company.name, value: company.name };
      });

    return list;
  };

  return (
    <Box display="flex" flexDirection="column" gap="15px" className="expenditure-details">
      <Typography textAlign="center" fontWeight="bold" fontSize="24px" mb="10px">
        Expenditure details
      </Typography>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap="10px">
        <Box border={error && !expenditureDetails.date ? "1px solid red" : "none"}>
          <DatePicker
            selected={expenditureDetails.date}
            onChange={(date) => setExpenditureDetails({ ...expenditureDetails, date: date })}
            dateFormat="dd MMM yyyy"
            wrapperClassName="date-picker form-floating"
            id="datePicker"
            className="form-control"
            placeholderText="Date *"
          />
        </Box>
        <FloatingLabel
          label="Total price *"
          style={{
            border: error && !expenditureDetails.totalPrice ? "1px solid red" : "none",
          }}
        >
          <Form.Control
            type="number"
            placeholder="Total price"
            value={
              isNumber(expenditureDetails.totalPrice)
                ? expenditureDetails.totalPrice / 100
                : expenditureDetails.totalPrice
            }
            onChange={(e) =>
              setExpenditureDetails({
                ...expenditureDetails,
                totalPrice: parseFloat(e.target.value) * 100,
              })
            }
          ></Form.Control>
        </FloatingLabel>
      </Box>
      <Box display="grid" gridTemplateColumns="1fr 1fr" gap="10px">
        <Box border={error && !expenditureDetails.company ? "1px solid red" : "none"}>
          <AsyncCreatableSelect
            cacheOptions
            loadOptions={promiseOptions}
            placeholder="Select a company *"
            value={
              expenditureDetails.company
                ? { label: expenditureDetails.company, value: expenditureDetails.company }
                : null
            }
            onChange={(newValue) => {
              if (newValue && newValue.value) {
                setExpenditureDetails({
                  ...expenditureDetails,
                  company: newValue.value,
                });
              }
            }}
            styles={{
              control: (styles) => ({
                ...styles,
                height: "58px",
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                display: "none",
              }),
              menu: (styles) => ({
                ...styles,
                zIndex: 5,
              }),
            }}
          ></AsyncCreatableSelect>
        </Box>
        <Box>
          <ReactSelect
            placeholder="Select a city"
            options={cityOptions}
            defaultValue={defaultCity}
            styles={{
              control: (styles) => ({
                ...styles,
                height: "58px",
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                display: "none",
              }),
              menu: (styles) => ({
                ...styles,
                zIndex: 5,
              }),
            }}
          ></ReactSelect>
        </Box>
      </Box>
      <FloatingLabel label="Settlement">
        <Form.Select>
          <option value="none">None</option>
          <option value="total">Total</option>
          <option value="partial">Partial</option>
        </Form.Select>
      </FloatingLabel>

      <Box>
        <Typography color="#a3a3a3">* mandatory fields</Typography>
      </Box>
    </Box>
  );
};

export default ExpenditureGeneralDetails;
