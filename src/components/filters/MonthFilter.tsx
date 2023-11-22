import ReactSelect from "react-select";
import { CURRENT_MONTH, MONTHS } from "../../utils";
import { capitalize } from "@mui/material";

type MonthFilterProps = {
  onChange: (arg: string) => void;
  options?: { label: string; value: string }[];
  defaultValue?: {
    label: string;
    value: string;
  };
};

const MonthFilter = ({ onChange, options, defaultValue }: MonthFilterProps) => {
  return (
    <ReactSelect
      options={
        options
          ? options
          : MONTHS.map((month) => {
              return { label: capitalize(month), value: month };
            })
      }
      defaultValue={defaultValue ? defaultValue : { label: capitalize(CURRENT_MONTH), value: CURRENT_MONTH }}
      onChange={(newValue) => onChange(newValue ? newValue.value : "")}
      styles={{
        indicatorSeparator: (styles) => ({
          ...styles,
          display: "none",
        }),
        container: (styles) => ({
          ...styles,
          width: "130px",
        }),
        menu: (styles) => ({
          ...styles,
          marginTop: "0px",
        }),
      }}
    />
  );
};

export default MonthFilter;
