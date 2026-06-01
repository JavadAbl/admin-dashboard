import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router";
import { store } from "./Store/Store";
import AppRoutes from "./Pages/AppRoutes";
import { Toaster } from "sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./Utils/Api/QueryClient";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
