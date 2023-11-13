import { IconDefinition, faAngleDoubleLeft, faAngleDoubleRight, faQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box } from "@mui/material";
import { useState } from "react";
import { Button, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import SignOutButton from "../../components/SignOutButton";
import { useLocalStorage } from "../../hooks/useLocalStorage";

type SideNavbarProps = {
  items: { path: string; name: string; icon?: IconDefinition }[];
};

const COLLAPSED_KEY = "sidebar-collapsed";
const SideNavbar = ({ items }: SideNavbarProps) => {
  const { getItem, setItem } = useLocalStorage();
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const collapsed = getItem(COLLAPSED_KEY);
    if (collapsed !== null) {
      return collapsed === "true";
    }

    setItem(COLLAPSED_KEY, "false");
    return false;
  });
  const location = useLocation();

  const handleCollapse = () => {
    setCollapsed((prev) => !prev);
    setItem(COLLAPSED_KEY, (!collapsed).toString());
  };

  return (
    <Navbar className={`navbar-side ${collapsed ? "collapsed" : ""}`} expand="lg">
      <Link className="sidebar-logo" to="/admin/dashboard">
        <img src={!collapsed ? "/images/logo.png" : "/favicon-32x32.png"} />
      </Link>

      <Box className="sidebar-menu">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-menu-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <FontAwesomeIcon icon={item.icon ?? faQuestion} className="menu-icon" title={collapsed ? item.name : ""} />
            {!collapsed && item.name}
          </Link>
        ))}
      </Box>
      <SignOutButton />

      <Button className="sidebar-toggle" onClick={handleCollapse}>
        <FontAwesomeIcon icon={!collapsed ? faAngleDoubleLeft : faAngleDoubleRight} className="menu-icon" />
        {!collapsed && "Collapse"}
      </Button>
    </Navbar>
  );
};

export default SideNavbar;
