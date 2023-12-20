import DashboardCategorySection from "../../features/user_dashboard/components/DashboardCategorySection";
import PageTitle from "../../layouts/user/PageTitle";
import DashboardPaymentSection from "../../features/user_dashboard/components/DashboardPaymentSection";

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
