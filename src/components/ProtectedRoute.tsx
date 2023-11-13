import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

type ProtectedRouteProps = {
  allowedRoles?: string[];
  children?: JSX.Element;
};

export const ProtectedRoute = ({ allowedRoles = [], children }: ProtectedRouteProps) => {
  const { user } = useContext(AuthContext);

  if (allowedRoles.length) {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
      if (user.role === "user") {
        return <Navigate to="/" replace />;
      }
      if (user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      }
    }
  }

  return children ? children : <Outlet />;
};
