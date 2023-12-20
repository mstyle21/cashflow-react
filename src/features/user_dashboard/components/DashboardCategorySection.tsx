import { Box } from "@mui/material";
import PeriodFilter, { TPeriodFilterItem } from "../../../components/filters/PeriodFilter";
import DashbordCardLogo from "./DashbordCardLogo";
import { useState } from "react";
import { CURRENT_MONTH, CURRENT_YEAR } from "../../../utils";
import DashboardCategoryGraph from "./DashboardCategoryGraph";
import MainCategoryFilter from "../../../components/filters/MainCategoryFilter";
import { useUserCategories } from "../../../api/getUserCategories";

const DashboardCategorySection = () => {
  const [periodFilters, setPeriodFilters] = useState<TPeriodFilterItem>({
    type: "month",
    title: "Month",
    value: {
      month: CURRENT_MONTH,
      year: CURRENT_YEAR.toString(),
    },
  });
  const [activeCategory, setActiveCategory] = useState(0);

  const mainCategories: { [id: number]: string } = {
    0: "All categories",
  };

  const { categories: organizedCategories } = useUserCategories({});
  if (organizedCategories) {
    organizedCategories.map((category) => {
      if (category.parent === null) {
        mainCategories[category.id] = category.name;
      }
    });
  }

  return (
    <section className="dashboard-card">
      <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
        <DashbordCardLogo path="/images/table-sign.png" title="Categories" />
        <Box display={"flex"} gap={"10px"}>
          <MainCategoryFilter
            mainCategories={mainCategories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
          <PeriodFilter setPeriodFilters={setPeriodFilters} />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center" gap="20px" height="350px">
        <DashboardCategoryGraph
          key={activeCategory}
          organizedCategories={organizedCategories ?? []}
          filters={{ ...periodFilters, categoryId: activeCategory }}
        />
      </Box>
    </section>
  );
};

export default DashboardCategorySection;
