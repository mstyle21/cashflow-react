import { Box } from "@mui/material";
import DashboardCardFilter, { TFilterItem } from "./DashboardCardFilter";
import DashbordCardLogo from "./DashbordCardLogo";
import { useState } from "react";
import DashboardPaymentStatistics from "./DashboardPaymentStatistics";
import { CURRENT_MONTH, CURRENT_YEAR } from "../../helpers/utils";

const DashboardPaymentSection = () => {
  const [paymentFilters, setPaymentFilters] = useState<TFilterItem>({
    type: "month",
    title: "Month",
    value: {
      month: CURRENT_MONTH,
      year: CURRENT_YEAR.toString(),
    },
  });

  return (
    <section className="dashboard-card">
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <DashbordCardLogo path="/images/dollar-sign.png" title="Payments" />
        <DashboardCardFilter elemId="paymentsFilter" setPaymentFilters={setPaymentFilters} />
      </Box>
      <Box display="flex" justifyContent="center" height="300px">
        <DashboardPaymentStatistics filters={paymentFilters} />
      </Box>
    </section>
  );
};

export default DashboardPaymentSection;
