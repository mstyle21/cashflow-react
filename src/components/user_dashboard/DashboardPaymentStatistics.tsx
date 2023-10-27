import { Box, capitalize } from "@mui/material";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import LoadingSpinner from "../LoadingSpinner";
import { BACKEND_URL, CURRENCY_SIGN, CURRENT_YEAR, MONTHS } from "../../helpers/utils";
import { TFilterItem } from "./DashboardCardFilter";
import { isArray } from "chart.js/helpers";
import moment from "moment";

const API_URL = `${BACKEND_URL}/api/expenditures/stats`;

interface TExpenditureStats {
  id: number;
  totalPrice: number;
  purchaseDate: string;
}

type DashboardPaymentStatisticsProps = {
  filters: TFilterItem;
};

const DashboardPaymentStatistics = ({ filters }: DashboardPaymentStatisticsProps) => {
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

  const { labels, stats: dataValues } = processPaymentStats(filters, data);

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

  const lineData = {
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
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Chart.js Line Chart",
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
    <Box width="100%" height="300px">
      <Line options={options} data={lineData} />
    </Box>
  );
};

export default DashboardPaymentStatistics;

function processPaymentStats(filters: TFilterItem, expenditureStats: TExpenditureStats[] | null) {
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
    });

    for (const [, value] of Object.entries(timeStats)) {
      stats.push(value / 100);
    }
  }

  return { labels, stats };
}
