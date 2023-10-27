import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer";
import TopNavbar from "../components/layout/TopNavbar";
import { Box } from "@mui/material";

export default function UserLayout() {
  return (
    <>
      <TopNavbar />
      <main
        className=""
        style={{
          display: "flex",
          flexGrow: "1",
          backgroundColor: "#f5f5fa",
          minHeight: `calc(100vh - 180px)`,
          paddingTop: "20px",
          paddingBottom: "50px",
        }}
      >
        <Box className="cf-container">
          <Outlet />
        </Box>
      </main>
      <Footer />
    </>
  );
}
