import PageTitle from "../../layouts/user/PageTitle";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/LoadingSpinner";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box } from "@mui/material";
import { Accordion, FloatingLabel, Form, FormControl } from "react-bootstrap";
import { debounce } from "chart.js/helpers";
import { TApiProductResponse } from "../../types";
import { BACKEND_URL, CURRENCY_SIGN } from "../../config";
import Paginator from "../../components/Paginator";

//TODO: to be simplified, SOLID principle
//TODO2: implement product`s expenditure details as: date, location and price
const ProductPage = () => {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const { isLoading, isError, data } = useQuery({
    queryKey: ["products", search, page, perPage],
    queryFn: async () => {
      let products: TApiProductResponse = {
        items: [],
        count: 0,
        pages: 0,
      };

      await axios
        .get<TApiProductResponse>(`${BACKEND_URL}/api/products?search=${search}&page=${page}&perPage=${perPage}`, {
          headers: { "x-access-token": user?.token ?? "missing-token" },
        })
        .then((response) => {
          products = response.data;
        })
        .catch((error) => {
          console.error(error);
        });

      return products;
    },
    keepPreviousData: true,
  });

  const handleInputSearch = debounce((value) => setSearch(value), 500);

  return (
    <div className="page-wrapper">
      <PageTitle title="Products" />
      <Box className="filters" display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Box>
          <FloatingLabel label="Search">
            <FormControl type="text" placeholder="" onChange={(e) => handleInputSearch(e.target.value)}></FormControl>
          </FloatingLabel>
        </Box>
        <Box>
          <FloatingLabel label="Per page" style={{ width: "110px" }}>
            <Form.Select
              onChange={(e) => {
                setPerPage(parseInt(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Select>
          </FloatingLabel>
        </Box>
      </Box>
      {isLoading && <LoadingSpinner />}
      {isError && <div className="alert alert-danger">Something went wrong. Please try again later</div>}
      {data && (
        <>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap="30px" className="product-list">
            {data.items.map((product) => {
              const totalSpendForProduct = product.expenditureItems.reduce((acc, item) => acc + item.totalPrice, 0);
              return (
                <Accordion key={product.id}>
                  <Accordion.Item eventKey={product.id.toString()}>
                    <Accordion.Header>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        width="100%"
                        borderRadius="8px"
                        mr="10px"
                        key={product.id}
                      >
                        <span>
                          {product.name} (<b>{product.expenditureItems.length}</b>)
                        </span>
                        <span>
                          {totalSpendForProduct / 100} {CURRENCY_SIGN}
                        </span>
                      </Box>
                    </Accordion.Header>
                    <Accordion.Body></Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              );
            })}
          </Box>
          <Box display="flex" justifyContent="center" mt="50px">
            <Paginator page={page} pages={data.pages} handlePageChange={setPage} />
          </Box>
        </>
      )}
    </div>
  );
};

export default ProductPage;
