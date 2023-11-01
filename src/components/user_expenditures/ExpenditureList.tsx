import { Box, Typography } from "@mui/material";
import moment from "moment";
import { CONFIG } from "../../config";

export type TApiExpenditure = {
  id: number;
  company: {
    name: string;
  };
  purchaseDate: string;
  totalPrice: number;
  items: {
    id: number;
    category: {
      id: number;
      name: string;
    };
    product: {
      id: number;
      name: string;
      description: string;
    };
    pricePerUnit: number;
    quantity: number;
    totalPrice: number;
  }[];
  images: {
    id: number;
    path: string;
  }[];
};

type ExpenditureListProps = {
  expenditures: TApiExpenditure[];
  openModal: (expenditure: TApiExpenditure) => void;
};
const ExpenditureList = ({ expenditures, openModal }: ExpenditureListProps) => {
  return (
    <>
      <Box display="grid" gridTemplateColumns="repeat(4, minmax(250px, 1fr))" gap="30px">
        {expenditures.map((expenditure: TApiExpenditure) => {
          const date = moment(new Date(expenditure.purchaseDate)).format("DD MMM YYYY");

          const imgPath =
            expenditure.images.length > 0
              ? `${CONFIG.backendUrl}/${expenditure.id}/${expenditure.images[0].path}`
              : "/images/default.jpg";

          return (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap="10px"
              key={expenditure.id}
              className="expenditure-box"
              onClick={() => openModal(expenditure)}
            >
              <Typography fontSize="20px" fontWeight="bold" pt="10px">
                {date}
              </Typography>
              <img src={imgPath} height="200px" width="auto" style={{ maxWidth: "100%" }} />
              <Box display="flex" justifyContent="space-between" width="100%" p="10px">
                <Typography fontWeight="bold">{expenditure.company.name}</Typography>
                <Typography fontWeight="bold">
                  {expenditure.totalPrice / 100} {CONFIG.currency}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default ExpenditureList;
