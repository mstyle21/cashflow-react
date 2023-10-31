import PageTitle from "../components/layout/PageTitle";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";
import { BACKEND_URL, CURRENCY_SIGN } from "../helpers/utils";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Box } from "@mui/material";
import { Accordion, FloatingLabel, Form, FormControl, Pagination } from "react-bootstrap";
import { debounce } from "chart.js/helpers";

export type TApiProduct = {
  id: number;
  name: string;
  description: string;
  expenditureItems: {
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    expenditure: {
      purchaseDate: string;
    };
  }[];
};
export type TApiProductResponse = {
  items: TApiProduct[];
  count: number;
  pages: number;
};

const Product = () => {
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

  const paginationItems = [];
  const paginationRange = 2;
  if (data && data.pages > 1) {
    for (let nr = 2; nr < data.pages; nr++) {
      if (nr >= page - paginationRange && nr <= page + paginationRange) {
        paginationItems.push(
          <Pagination.Item key={nr} active={nr === page} onClick={() => setPage(nr)}>
            {nr}
          </Pagination.Item>
        );
      }
    }
  }

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
            <Pagination style={{ gap: "10px" }}>
              {page > 1 && (
                <>
                  <Pagination.Prev onClick={() => setPage((prev) => prev - 1)} />
                </>
              )}
              <Pagination.Item active={page === 1} onClick={() => setPage(1)}>
                1
              </Pagination.Item>
              {page > 2 + paginationRange && <Pagination.Ellipsis disabled />}
              {paginationItems}
              {page < data.pages - paginationRange - 1 && <Pagination.Ellipsis disabled />}
              {data.pages > 1 && (
                <Pagination.Item active={page === data.pages} onClick={() => setPage(data.pages)}>
                  {data.pages}
                </Pagination.Item>
              )}
              {page < data.pages && (
                <>
                  <Pagination.Next onClick={() => setPage((prev) => prev + 1)} />
                </>
              )}
            </Pagination>
          </Box>
        </>
      )}
    </div>
  );
};

export default Product;
