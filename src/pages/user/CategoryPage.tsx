import PageTitle from "../../layouts/user/PageTitle";
import CategoryList from "../../features/user_categories/components/CategoryList";

const CategoryPage = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Categories" />
      <CategoryList />
    </div>
  );
};

export default CategoryPage;
