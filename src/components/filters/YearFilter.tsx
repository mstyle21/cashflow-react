import ReactSelect from "react-select";
import { CURRENT_YEAR, arrayRange } from "../../utils";

type YearFilterProps = {
  onChange: (arg: string) => void;
  options?: { label: string; value: string }[];
  defaultValue?: {
    label: string;
    value: string;
  };
};
const YearFilter = ({ onChange, options, defaultValue }: YearFilterProps) => {
  const years: number[] = arrayRange(2023, CURRENT_YEAR);

  return (
    <ReactSelect
      options={
        options
          ? options
          : years.map((year) => {
              return { label: year.toString(), value: year.toString() };
            })
      }
      defaultValue={defaultValue ? defaultValue : { label: CURRENT_YEAR.toString(), value: CURRENT_YEAR.toString() }}
      onChange={(newValue) => onChange(newValue ? newValue.value : "")}
      styles={{
        indicatorSeparator: (styles) => ({
          ...styles,
          display: "none",
        }),
        container: (styles) => ({
          ...styles,
          width: "100px",
        }),
        menu: (styles) => ({
          ...styles,
          marginTop: "0px",
        }),
      }}
    />
  );
};

export default YearFilter;
