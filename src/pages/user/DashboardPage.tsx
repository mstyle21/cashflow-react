import DashboardCategorySection from "../../components/user_dashboard/DashboardCategorySection";
import PageTitle from "../../layouts/user/PageTitle";
import DashboardPaymentSection from "../../components/user_dashboard/DashboardPaymentSection";

const DashboardPage = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Dashboard" />
      <DashboardPaymentSection />
      <DashboardCategorySection />
    </div>
  );
};

export default DashboardPage;
