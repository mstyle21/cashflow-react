import PageTitle from "../../layouts/user/PageTitle";
import ProductList from "../../features/user_products/components/ProductList";

const ProductPage = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Products" />
      <ProductList />
    </div>
  );
};

export default ProductPage;
