import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { lazy } from "react";

const UserLayout = lazy(() => import("./layouts/user/UserLayout"));
const DashboardPage = lazy(() => import("./pages/user/DashboardPage"));
const ExpenditurePage = lazy(() => import("./pages/user/ExpenditurePage"));
const CategoryPage = lazy(() => import("./pages/user/CategoryPage"));
const ProductPage = lazy(() => import("./pages/user/ProductPage"));

const AdminLayout = lazy(() => import("./layouts/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/DashboardPage"));
const AdminCategories = lazy(() => import("./pages/admin/CategoryPage"));
const AdminProducts = lazy(() => import("./pages/admin/ProductPage"));
const UserList = lazy(() => import("./pages/admin/UserPage"));

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
        element: <DashboardPage />,
      },
      {
        path: "expenditures",
        element: <ExpenditurePage />,
      },
      {
        path: "categories",
        element: <CategoryPage />,
      },
      {
        path: "products",
        element: <ProductPage />,
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
    children: [
      {
        index: true,
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "categories",
        element: <AdminCategories />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "users",
        element: <UserList />,
      },
    ],
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
