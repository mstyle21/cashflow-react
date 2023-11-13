import { Box } from "@mui/material";
import styles from "./TopNavbar.module.css";
import { Link } from "react-router-dom";
import SignOutButton from "../../components/SignOutButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const MENU_ITEMS = [
  { path: "/", name: "Dashboard" },
  { path: "/expenditures", name: "Expenditure" },
  { path: "/categories", name: "Categories" },
  { path: "/products", name: "Products" },
  // { path: "/budget", name: "Budget" },
];

function LinkNavbar() {
  return (
    <ul className={styles.link_navbar}>
      {MENU_ITEMS.map((item, index) => {
        return (
          <li key={index}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        );
      })}
    </ul>
  );
}

function LinkLogo() {
  return (
    <Link to="/">
      <img height="50px" src="/images/logo.png" />
    </Link>
  );
}

function AccountMenu() {
  return (
    <div className={styles.account_menu_container}>
      <FontAwesomeIcon icon={faUser} size="xl" className={styles.account_icon} />
      <div className={styles.account_menu}>
        <SignOutButton />
      </div>
    </div>
  );
}

export default function TopNavbar() {
  return (
    <header className={styles.top_navbar}>
      <Box display="flex" justifyContent="space-between" alignItems="center" className="cf-container">
        <LinkLogo />
        <LinkNavbar />
        <AccountMenu />
      </Box>
    </header>
  );
}
