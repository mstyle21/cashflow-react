import { Box } from "@mui/material";
import PeriodFilter, { TPeriodFilterItem } from "../PeriodFilter";
import DashbordCardLogo from "./DashbordCardLogo";
import { useContext, useState } from "react";
import { BACKEND_URL, CURRENT_MONTH, CURRENT_YEAR } from "../../helpers/utils";
import DashboardCategoryGraph from "./DashboardCategoryGraph";
import MainCategoryFilter from "../MainCategoryFilter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import LoadingSpinner from "../LoadingSpinner";
import { TApiCategory } from "../user_expenditures/ExpenditureItemList";

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

  const { user } = useContext(AuthContext);
  const {
    isLoading: loadingCategories,
    error: errorCategories,
    data: organizedCategories,
  } = useQuery(
    ["categories"],
    async () => {
      try {
        const response = await axios.get<TApiCategory[]>(`${BACKEND_URL}/api/categories/?organized=true`, {
          headers: { "x-access-token": user?.token ?? "missing-token" },
        });

        return response.data ?? [];
      } catch (error) {
        console.error(error);
      }

      return [];
    },
    {
      staleTime: 300000,
    }
  );

  if (loadingCategories) return <LoadingSpinner />;
  if (errorCategories) return <div className="alert alert-danger">Something went wrong</div>;

  const mainCategories: { [id: number]: string } = {
    0: "All categories",
  };
  if (organizedCategories) {
    organizedCategories.map((category) => {
      if (category.parent === null) {
        mainCategories[category.id] = category.name;
      }
    });
  }

  const categoryFilters = { ...periodFilters, categoryId: activeCategory };

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
      <Box display="flex" justifyContent="center" height="300px">
        <DashboardCategoryGraph
          key={activeCategory}
          organizedCategories={organizedCategories ?? []}
          filters={categoryFilters}
        />
      </Box>
    </section>
  );
};

export default DashboardCategorySection;