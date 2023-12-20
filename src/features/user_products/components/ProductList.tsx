import { Box } from "@mui/material";
import { FloatingLabel, FormControl, Accordion, Form } from "react-bootstrap";
import { useProducts } from "../../../api/getProducts";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Paginator from "../../../components/Paginator";
import { CURRENCY_SIGN } from "../../../config";
import { useProductFilters } from "../hooks/useProductFilters";

//TODO: implement product`s expenditure details as: date, location and price
const ProductList = () => {
  const { search, page, perPage, setInputSearch, setPage, setPerPage } = useProductFilters();
  const { products, pages, error, isLoading } = useProducts({ search, page, perPage });

  return (
    <>
      <Box className="filters" display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Box>
          <FloatingLabel label="Search">
            <FormControl type="text" placeholder="" onChange={(e) => setInputSearch(e.target.value)}></FormControl>
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
      {error && <div className="alert alert-danger">Something went wrong. Please try again later</div>}
      {products && (
        <>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap="30px" className="product-list">
            {products.map((product) => {
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
            <Paginator page={page} pages={pages} handlePageChange={setPage} />
          </Box>
        </>
      )}
    </>
  );
};

export default ProductList;
