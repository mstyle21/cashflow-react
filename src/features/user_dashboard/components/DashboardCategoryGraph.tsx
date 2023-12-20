import { Box, Typography } from "@mui/material";
import { COLORS } from "../../../utils";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { TPeriodFilterItem } from "../../../components/filters/PeriodFilter";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ArcElement,
} from "chart.js";

import { isArray } from "chart.js/helpers";
import { CURRENCY_SIGN } from "../../../config";
import { ApiCategory, ApiExpenditureItem } from "../../../types";
import { useUserCategoryStats } from "../../../api/getUserCategoryStats";

type DashboardCategoryGraphProps = {
  organizedCategories: ApiCategory[];
  filters: TPeriodFilterItem & { categoryId: number };
};

const DashboardCategoryGraph = ({ organizedCategories, filters }: DashboardCategoryGraphProps) => {
  const { categoryStats, error, isLoading } = useUserCategoryStats({
    month: filters.value.month,
    year: filters.value.year,
    type: filters.type,
    category: filters.categoryId,
  });

  if (error) {
    return <div className="alert alert-danger">Something went wrong.</div>;
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const { labels, organizedStats, totalSpent } = processCategoryStats(
    organizedCategories,
    categoryStats,
    filters.categoryId
  );

  const pieData: ChartData<"pie"> = {
    labels: labels,
    datasets: [
      {
        data: organizedStats,
        backgroundColor: COLORS,
      },
    ],
  };
  const pieOptions: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: window.outerWidth < 600 ? "top" : "left",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.formattedValue} ${CURRENCY_SIGN}`;
          },
        },
      },
    },
  };

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

  return (
    <>
      <Box>
        <Typography fontWeight="bold" fontSize="30px">
          {totalSpent / 100} {CURRENCY_SIGN}
        </Typography>
      </Box>
      <Box width="100%" height="300px">
        <Pie options={pieOptions} data={pieData} />
      </Box>
    </>
  );
};

export default DashboardCategoryGraph;

const processCategoryStats = (
  categoryList: ApiCategory[] | undefined,
  expenditureItems: ApiExpenditureItem[],
  parentFilter: number
) => {
  const labels: string[] = [];
  const organizedStats: number[] = [];

  const selectedCategory: { [key: number]: { name: string; value: number } } = {};

  if (isArray(categoryList) && categoryList.length) {
    categoryList.forEach((category) => {
      if (parentFilter === 0 && category.parent === null) {
        selectedCategory[category.id] = {
          name: category.name,
          value: 0,
        };
      }
      if (parentFilter !== 0 && category.parent) {
        if (category.parent.id === parentFilter) {
          selectedCategory[category.id] = {
            name: category.name,
            value: 0,
          };
        }
      }
    });
  }

  if (isArray(expenditureItems) && expenditureItems.length) {
    expenditureItems.forEach((expenditureItem) => {
      const categId = parentFilter !== 0 ? expenditureItem.category.id : expenditureItem.category.parent.id;

      if (selectedCategory[categId] !== undefined) {
        selectedCategory[categId].value += expenditureItem.totalPrice;
      }
    });
  }

  //sort categories by price DESC
  const sortedCategories = Object.entries(selectedCategory).sort((a, b) => b[1].value - a[1].value);

  let totalSpent = 0;
  for (const sortedCategory of sortedCategories) {
    labels.push(`${sortedCategory[1].name} (${sortedCategory[1].value / 100})`);
    organizedStats.push(sortedCategory[1].value / 100);
    totalSpent += sortedCategory[1].value;
  }

  return { labels, organizedStats, totalSpent };
};
