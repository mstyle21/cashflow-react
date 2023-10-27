import { Box } from "@mui/material";
import { CURRENCY_SIGN } from "../../helpers/utils";

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
          const date = new Date(expenditure.purchaseDate);
          const year = new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }).format(date);
          const imgPath =
            expenditure.images.length > 0
              ? `http://localhost:7000/${expenditure.id}/${expenditure.images[0].path}`
              : null;

          return (
            <Box key={expenditure.id} className="expenditure-box" onClick={() => openModal(expenditure)}>
              <p>{expenditure.company.name}</p>
              <p>{year}</p>
              <p>
                {expenditure.totalPrice / 100} {CURRENCY_SIGN}
              </p>
              {imgPath && <img src={imgPath} height="150px" width="auto" style={{ maxWidth: "100%" }} />}
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default ExpenditureList;
