import { Box, Typography } from "@mui/material";
import { BACKEND_URL, COLORS, CURRENCY_SIGN } from "../../helpers/utils";
import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../LoadingSpinner";
import { TPeriodFilterItem } from "../PeriodFilter";
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
import { TApiCategory } from "../../pages/Category";

const API_URL = `${BACKEND_URL}/api/categories/stats`;

type TExpenditureItemsStats = {
  id: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  category: {
    id: number;
    name: string;
    parent: {
      id: number;
      name: string;
    };
  };
};

type DashboardCategoryGraphProps = {
  organizedCategories: TApiCategory[];
  filters: TPeriodFilterItem & { categoryId: number };
};

const DashboardCategoryGraph = ({ organizedCategories, filters }: DashboardCategoryGraphProps) => {
  const { data, isLoading, error } = useFetch<TExpenditureItemsStats[]>(
    `${API_URL}?month=${filters.value.month}&year=${filters.value.year}&type=${filters.type}&category=${filters.categoryId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (error) {
    return <div>{error}</div>;
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const { labels, organizedStats, totalSpent } = processCategoryStats(organizedCategories, data, filters.categoryId);

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
  categoryList: TApiCategory[] | undefined,
  expenditureItems: TExpenditureItemsStats[] | null,
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
