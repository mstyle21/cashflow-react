import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminLayout from "./layouts/admin/AdminLayout";
import { default as AdminDashboard } from "./pages/admin/DashboardPage";
import { default as AdminCategories } from "./pages/admin/CategoryPage";
import { default as AdminProducts } from "./pages/admin/ProductPage";
import { default as UserList } from "./pages/admin/UserPage";
import UserLayout from "./layouts/user/UserLayout";
import DashboardPage from "./pages/user/DashboardPage";
import ExpenditurePage from "./pages/user/ExpenditurePage";
import CategoryPage from "./pages/user/CategoryPage";
import ProductPage from "./pages/user/ProductPage";

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
