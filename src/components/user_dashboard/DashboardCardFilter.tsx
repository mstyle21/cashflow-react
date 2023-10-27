import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, capitalize } from "@mui/material";
import React, { ReactNode, useState } from "react";
import { Dropdown } from "react-bootstrap";
import ReactSelect from "react-select";
import { CURRENT_MONTH, CURRENT_YEAR } from "../../helpers/utils";

type DashboardCardFilterProps = {
  elemId: string;
  setPaymentFilters: React.Dispatch<React.SetStateAction<TFilterItem>>;
};
type TFilterItemValue = {
  month: string;
  year: string;
};
export type TFilterItem = {
  type: "allTime" | "month" | "year";
  title: string;
  content?: ReactNode;
  value: TFilterItemValue;
};

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const years: number[] = [];
let startYear = 2020;
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
do {
  years.push(startYear);
  startYear++;
} while (startYear <= currentYear);

const yearOptions = years.map((year) => {
  return { value: year, label: year };
});

type TFilterProps = {
  handleFilterSelection: (type: "month" | "year", value: TFilterItemValue) => void | boolean;
};
const MonthFilter = ({ handleFilterSelection }: TFilterProps) => {
  const [month, setMonth] = useState(months[currentMonth]);
  const [year, setYear] = useState(currentYear.toString());

  const monthOptions = months.map((monthOption) => {
    return { value: monthOption, label: capitalize(monthOption) };
  });

  return (
    <>
      <ReactSelect
        options={monthOptions}
        defaultValue={{
          value: months[currentMonth],
          label: capitalize(months[currentMonth]),
        }}
        menuShouldScrollIntoView={true}
        onChange={(result) => {
          if (result && result.value) {
            setMonth(result.value);
            handleFilterSelection("month", { month: result.value, year: year });
          }
        }}
        styles={{
          indicatorSeparator: (styles) => ({
            ...styles,
            display: "none",
          }),
          container: (styles) => ({
            ...styles,
            width: "100%",
          }),
          option: (styles) => ({
            ...styles,
            color: "#000",
          }),
        }}
      />
      <ReactSelect
        options={yearOptions}
        defaultValue={{ value: currentYear, label: currentYear }}
        onChange={(result) => {
          if (result && result.value) {
            setYear(result.value.toString());
            handleFilterSelection("month", {
              month: month,
              year: result.value.toString(),
            });
          }
        }}
        styles={{
          indicatorSeparator: (styles) => ({
            ...styles,
            display: "none",
          }),
          container: (styles) => ({
            ...styles,
            width: "75%",
          }),
          option: (styles) => ({
            ...styles,
            color: "#000",
          }),
        }}
      />
    </>
  );
};

const YearFilter = ({ handleFilterSelection }: TFilterProps) => {
  return (
    <>
      <ReactSelect
        options={yearOptions}
        defaultValue={{ value: currentYear, label: currentYear }}
        onChange={(e) => {
          const year = e && e.value ? e.value.toString() : currentYear.toString();
          handleFilterSelection("year", {
            month: CURRENT_MONTH,
            year: year,
          });
        }}
        styles={{
          indicatorSeparator: (styles) => ({
            ...styles,
            display: "none",
          }),
          container: (styles) => ({
            ...styles,
            width: "100%",
          }),
          option: (styles) => ({
            ...styles,
            color: "#000",
          }),
        }}
      />
    </>
  );
};

/**
 * Dashboard Card Filter Component
 *
 * @param param0
 * @returns
 */
const DashboardCardFilter = ({ elemId, setPaymentFilters }: DashboardCardFilterProps) => {
  const [activeFilter, setActiveFilter] = useState<TFilterItem>({
    type: "month",
    title: "Month",
    value: {
      month: months[currentMonth],
      year: currentYear.toString(),
    },
  });

  const handleFilterSelection = (type: string, values: TFilterItemValue) => {
    let filterItem = items.find((elem) => elem.type === type);

    if (filterItem === undefined || filterItem === null) {
      //get first value as default
      filterItem = items[0];
    } else {
      filterItem.value = values;
    }

    delete filterItem.content;

    setActiveFilter(filterItem);
    setPaymentFilters(filterItem);
  };

  const items: TFilterItem[] = [
    {
      type: "allTime",
      title: "All time",
      content: "",
      value: { month: CURRENT_MONTH, year: CURRENT_YEAR.toString() },
    },
    {
      type: "month",
      title: "Month",
      content: <MonthFilter handleFilterSelection={handleFilterSelection} />,
      value: { month: months[currentMonth], year: currentYear.toString() },
    },
    {
      type: "year",
      title: "Year",
      content: <YearFilter handleFilterSelection={handleFilterSelection} />,
      value: { month: months[currentMonth], year: currentYear.toString() },
    },
  ];

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle variant="default" className="dc-filter-btn" id={elemId}>
        <span style={{ marginRight: "10px" }}>{activeFilter.title}</span>
        <FontAwesomeIcon icon={faCalendar} />
      </Dropdown.Toggle>
      <Dropdown.Menu as="div" className="dc-filter-dd">
        {items.map((item) => (
          <Dropdown.Item
            key={item.type}
            as="div"
            active={item.type === activeFilter.type}
            onClick={() => {
              if (item.type !== activeFilter.type) {
                //avoid double handle from click when already active and changing sub-fields
                handleFilterSelection(item.type, item.value);
              }
            }}
          >
            <Box className="dd-item-title">{item.title}</Box>
            {item.type === activeFilter.type && typeof item.content === "object" && (
              <Box
                display={item.type === activeFilter.type ? "flex" : "none"}
                justifyContent="space-between"
                alignItems="center"
                gap="10px"
              >
                {item.content}
              </Box>
            )}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default DashboardCardFilter;
