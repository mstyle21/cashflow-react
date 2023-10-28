import DashboardCategorySection from "../components/user_dashboard/DashboardCategorySection";
import PageTitle from "../components/layout/PageTitle";
import DashboardPaymentSection from "../components/user_dashboard/DashboardPaymentSection";

const Dashboard = () => {
  return (
    <div className="page-wrapper">
      <PageTitle title="Dashboard" />
      <DashboardPaymentSection />
      <DashboardCategorySection />
    </div>
  );
};

export default Dashboard;
