import { Box, Typography } from "@mui/material";
import moment from "moment";
import { ApiExpenditure } from "../../../types";
import { BACKEND_URL, CURRENCY_SIGN } from "../../../config";
import { DEFAULT_IMAGE } from "../../../utils";

type ExpenditureListProps = {
  expenditures: ApiExpenditure[];
  openModal: (expenditure: ApiExpenditure) => void;
};

const ExpenditureList = ({ expenditures, openModal }: ExpenditureListProps) => {
  return (
    <>
      <Box display="grid" gridTemplateColumns="repeat(4, minmax(250px, 1fr))" gap="30px">
        {expenditures.map((expenditure: ApiExpenditure) => {
          const date = moment(new Date(expenditure.purchaseDate)).format("DD MMM YYYY");

          const imgPath =
            expenditure.images.length > 0
              ? `${BACKEND_URL}/${expenditure.id}/${expenditure.images[0].path}`
              : DEFAULT_IMAGE;

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
                  {expenditure.totalPrice / 100} {CURRENCY_SIGN}
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
