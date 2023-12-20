import { useAuth } from "./hooks/useAuth";
import { AuthContext } from "./context/AuthContext";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

const router = createBrowserRouter(routes);

export default function App() {
  const { user, loginRedirect, login, logout, getTokenStatus } = useAuth();

  //TODO: find a better way to check token availability
  useEffect(() => {
    if (getTokenStatus() === "expired") {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queryClient = new QueryClient();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthContext.Provider value={{ user, loginRedirect, login, logout }}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
        </QueryClientProvider>
      </AuthContext.Provider>
    </Suspense>
  );
}
