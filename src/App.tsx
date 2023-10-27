import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/AuthContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter(routes);

export default function App() {
  const { user, loginRedirect, login, logout } = useAuth();

  const queryClient = new QueryClient();

  return (
    <AuthContext.Provider value={{ user, loginRedirect, login, logout }}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}
