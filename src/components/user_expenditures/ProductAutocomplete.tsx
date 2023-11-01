import { debounce } from "@mui/material";
import { SetStateAction, useContext, useMemo, useState } from "react";
import axios, { AxiosError } from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Dropdown, FloatingLabel, Form } from "react-bootstrap";
import { TApiProduct } from "../../pages/Product";
import { CONFIG } from "../../config";

const ProductAutocomplete = ({
  itemName,
  setItemName,
}: {
  itemName: string;
  setItemName: React.Dispatch<SetStateAction<string>>;
}) => {
  const { logout } = useContext(AuthContext);

  const { user } = useContext(AuthContext);
  const [options, setOptions] = useState<string[]>([]);

  const getProducts = async (value: string) => {
    let options: string[] = [];
    if (value !== "" && value.length > 0) {
      try {
        const response = await axios.get<TApiProduct[]>(
          `${CONFIG.backendUrl}/api/products/autocomplete/?search=${value}`,
          {
            headers: { "x-access-token": user?.token ?? "missing-token" },
          }
        );

        options = response.data.map((product) => product.name);
      } catch (e) {
        if (e instanceof AxiosError && e.message.includes("Token expired!")) {
          logout();
        }
        console.error(e);
      }
    }
    setOptions(options);
  };

  const handleInputChange = (value: string) => {
    setItemName(value);
    debouncedOnInputChange(value);
  };

  const debouncedOnInputChange = useMemo(() => {
    return debounce((value) => getProducts(value), 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <FloatingLabel label="Item name">
        <Form.Control
          type="text"
          placeholder="Item name"
          value={itemName}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={(e) => {
            if (e.target.value.length > 0) {
              getProducts(e.target.value);
            }
          }}
          onBlur={() => {
            setOptions([]);
          }}
          aria-controls="productAutocomplete"
        ></Form.Control>
      </FloatingLabel>

      {options.length > 0 && (
        <Dropdown.Menu className="product-autocomplete" id="productAutocomplete" show>
          {options.map((option, index) => (
            <Dropdown.Item
              key={index}
              onMouseDown={() => {
                setItemName(option);
                setOptions([]);
              }}
            >
              {option}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      )}
    </div>
  );
};

export default ProductAutocomplete;
