import { ProtectedRoute } from "./components/ProtectedRoute";
import AdminLayout from "./pages/AdminLayout";
import Category from "./pages/Category";
import Dashboard from "./pages/Dashboard";
import Expenditure from "./pages/Expenditure";
import Login from "./pages/Login";
import UserLayout from "./pages/UserLayout";

export const routes = [
  {
    id: "root",
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "expenditures",
        element: <Expenditure />,
      },
      {
        path: "categories",
        element: <Category />,
      },
      {
        path: "*",
        Component: () => {
          return <>404</>;
        },
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: (
      <ProtectedRoute>
        <Login />
      </ProtectedRoute>
    ),
  },
];