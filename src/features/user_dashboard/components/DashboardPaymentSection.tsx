import { Box } from "@mui/material";
import PeriodFilter, { TPeriodFilterItem } from "../../../components/filters/PeriodFilter";
import DashbordCardLogo from "./DashbordCardLogo";
import { useState } from "react";
import DashboardPaymentGraph from "./DashboardPaymentGraph";
import { CURRENT_MONTH, CURRENT_YEAR } from "../../../utils";

const DashboardPaymentSection = () => {
  const [periodFilters, setPeriodFilters] = useState<TPeriodFilterItem>({
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
        <PeriodFilter setPeriodFilters={setPeriodFilters} />
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" gap="20px" height="350px">
        <DashboardPaymentGraph filters={periodFilters} />
      </Box>
    </section>
  );
};

export default DashboardPaymentSection;
