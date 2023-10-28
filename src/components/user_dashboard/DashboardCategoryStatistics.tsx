import { Box } from "@mui/material";
import { BACKEND_URL, COLORS, CURRENCY_SIGN } from "../../helpers/utils";
import useFetch from "../../hooks/useFetch";
import LoadingSpinner from "../LoadingSpinner";
import { TFilterItem } from "./DashboardCardFilter";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TApiCategory } from "../user_expenditures/ExpenditureItemList";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API_URL = `${BACKEND_URL}/api/categories/stats`;

type TCategoryStats = {
  id: number;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  category: {
    id: number;
    name: string;
  };
};

const DashboardCategoryStatistics = ({ filters }: { filters: TFilterItem }) => {
  const { user } = useContext(AuthContext);
  const {
    isLoading: loadingCategories,
    error: errorCategories,
    data: categoryData,
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

  const { data, isLoading, error } = useFetch<TCategoryStats[]>(
    `${API_URL}?month=${filters.value.month}&year=${filters.value.year}&type=${filters.type}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (loadingCategories) return <LoadingSpinner />;
  if (errorCategories) return <div className="alert alert-danger">Something went wrong</div>;

  if (error) {
    return <div>{error}</div>;
  }
  if (isLoading) {
    return <LoadingSpinner />;
  }

  const parentFilter = null;

  const { labels, organizedStats } = processCategoryStats(categoryData, data, parentFilter);

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
    <Box width="100%" height="300px">
      <Pie options={pieOptions} data={pieData} />
    </Box>
  );
};

export default DashboardCategoryStatistics;

const processCategoryStats = (
  categoryData: TApiCategory[] | undefined,
  categoryStats: TCategoryStats[] | null,
  parentFilter: number | null
) => {
  const labels: string[] = [];
  const organizedStats: number[] = [];

  const selectedCategory: { [key: number]: { name: string; value: number } } = {};

  const childParentList: { [key: number]: number } = {};
  if (isArray(categoryData) && categoryData.length) {
    categoryData?.forEach((category) => {
      if (parentFilter === null && category.parent === parentFilter) {
        selectedCategory[category.id] = {
          name: category.name,
          value: 0,
        };
      } else {
        if (category.parent) {
          if (category.parent.id === parentFilter) {
            selectedCategory[category.id] = {
              name: category.name,
              value: 0,
            };
          }
          childParentList[category.id] = category.parent.id;
        }
      }
    });
  }

  if (isArray(categoryStats) && categoryStats.length) {
    categoryStats.forEach((expenditureItem) => {
      const categId = parentFilter ? expenditureItem.category.id : childParentList[expenditureItem.category.id];
      selectedCategory[categId].value += expenditureItem.totalPrice;
    });
  }

  //sort categories by price DESC
  const sortedCategories = Object.entries(selectedCategory).sort((a, b) => b[1].value - a[1].value);

  for (const sortedCategory of sortedCategories) {
    labels.push(`${sortedCategory[1].name} (${sortedCategory[1].value / 100})`);
    organizedStats.push(sortedCategory[1].value / 100);
  }

  return { labels, organizedStats };
};
