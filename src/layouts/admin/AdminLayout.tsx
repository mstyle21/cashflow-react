import { Outlet } from "react-router-dom";
import SideNavbar from "./SideNavbar";
// import TopNavbar from "./TopNavbar";
import { Container } from "react-bootstrap";
import { faChartLine, faThLarge, faUsers, faShoppingBag } from "@fortawesome/free-solid-svg-icons";

const MENU_ITEMS = [
  { path: "/admin/dashboard", name: "Dashboard", icon: faChartLine },
  { path: "/admin/categories", name: "Categories", icon: faThLarge },
  { path: "/admin/products", name: "Products", icon: faShoppingBag },
  { path: "/admin/users", name: "Users", icon: faUsers },
];

export default function AdminLayout() {
  return (
    <Container fluid className="admin-container px-0">
      {/* <TopNavbar /> */}
      <SideNavbar items={MENU_ITEMS} />
      <div className="content">
        <Outlet />
      </div>
    </Container>
  );
}
