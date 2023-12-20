import { Box } from "@mui/material";

type DashbordCardLogoProps = {
  path: string;
  title: string;
};
const DashbordCardLogo = ({ path, title }: DashbordCardLogoProps) => {
  return (
    <Box display={"flex"} gap={"10px"} alignItems={"center"}>
      <img src={path} alt="dashboard-card-logo" />
      <span style={{ fontSize: "24px", fontWeight: "bold" }}>{title}</span>
    </Box>
  );
};

export default DashbordCardLogo;
