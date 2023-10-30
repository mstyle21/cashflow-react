import { Box, Typography, capitalize } from "@mui/material";
import useFetch from "../../hooks/useFetch";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import LoadingSpinner from "../LoadingSpinner";
import { BACKEND_URL, CURRENCY_SIGN, CURRENT_YEAR, MONTHS } from "../../helpers/utils";
import { TPeriodFilterItem } from "../PeriodFilter";
import { isArray } from "chart.js/helpers";
import moment from "moment";

const API_URL = `${BACKEND_URL}/api/expenditures/stats`;

interface TExpenditureStats {
  id: number;
  totalPrice: number;
  purchaseDate: string;
}

type DashboardPaymentGraphProps = {
  filters: TPeriodFilterItem;
};

const DashboardPaymentGraph = ({ filters }: DashboardPaymentGraphProps) => {
  const { data, isLoading, error } = useFetch<TExpenditureStats[]>(
    `${API_URL}?month=${filters.value.month}&year=${filters.value.year}&type=${filters.type}`,
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

  const { labels, stats: dataValues, totalSpent } = processPaymentStats(filters, data);

  let label: string;
  switch (filters.type) {
    default:
    case "allTime":
      label = "All time";
      break;
    case "month":
      label = `${capitalize(filters.value.month ?? "")} ${filters.value.year}`;
      break;
    case "year":
      label = `${filters.value.year}`;
      break;
  }

  const lineData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: label,
        data: dataValues,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const lineOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.formattedValue} ${CURRENCY_SIGN}`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
        },
      },
      y: {
        min: Math.min(...dataValues),
        ticks: {
          callback: (tickValue: string | number) => {
            return `${tickValue} ${CURRENCY_SIGN}`;
          },
        },
      },
    },
  };

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  return (
    <>
      <Box>
        <Typography fontWeight="bold" fontSize="30px">
          {totalSpent / 100} {CURRENCY_SIGN}
        </Typography>
      </Box>
      <Box width="100%" height="300px">
        <Line options={lineOptions} data={lineData} />
      </Box>
    </>
  );
};

export default DashboardPaymentGraph;

function processPaymentStats(filters: TPeriodFilterItem, expenditureStats: TExpenditureStats[] | null) {
  const labels: string[] = [];
  const stats: number[] = [];

  let momentFormat: string;
  switch (filters.type) {
    case "allTime":
      momentFormat = "MMM YYYY";
      for (let year = 2023; year <= CURRENT_YEAR; year++) {
        for (let month = 1; month <= 12; month++) {
          const m = month < 10 ? `0${month}` : month.toString();
          labels.push(moment(new Date(`${year}-${m}-01`)).format(momentFormat));
        }
      }
      break;
    default:
    case "month":
      momentFormat = "D";
      for (let day = 1; day <= 31; day++) {
        labels.push(`${day}`);
      }
      break;
    case "year":
      momentFormat = "MMM YYYY";
      MONTHS.forEach((month) => {
        month = month.slice(0, 3);
        labels.push(`${month[0].toUpperCase() + month.slice(1)} ${filters.value.year}`);
      });
      break;
  }

  let totalSpent = 0;
  if (isArray(expenditureStats) && expenditureStats.length) {
    const timeStats: { [key: string]: number } = {};
    labels.forEach((label) => {
      timeStats[label] = 0;
    });

    expenditureStats.forEach((expenditureDetails) => {
      const purchaseDate = moment(expenditureDetails.purchaseDate).format(momentFormat);

      if (timeStats[purchaseDate] !== undefined) {
        timeStats[purchaseDate] += expenditureDetails.totalPrice;
      } else {
        console.error("Something went wrong with chart labels");
      }

      totalSpent += expenditureDetails.totalPrice;
    });

    for (const [, value] of Object.entries(timeStats)) {
      stats.push(value / 100);
    }
  }

  return { labels, stats, totalSpent };
}
