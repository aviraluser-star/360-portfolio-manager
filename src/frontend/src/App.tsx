import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import { Suspense, lazy } from "react";
import { Layout } from "./components/Layout";
import { PageLoader } from "./components/LoadingSpinner";

const DashboardPage = lazy(() =>
  import("./pages/Dashboard").then((m) => ({ default: m.DashboardPage })),
);
const HoldingsPage = lazy(() =>
  import("./pages/Holdings").then((m) => ({ default: m.HoldingsPage })),
);
const RecommendationsPage = lazy(() =>
  import("./pages/Recommendations").then((m) => ({
    default: m.RecommendationsPage,
  })),
);
const RiskPage = lazy(() =>
  import("./pages/Risk").then((m) => ({ default: m.RiskPage })),
);
const TaxPage = lazy(() =>
  import("./pages/Tax").then((m) => ({ default: m.TaxPage })),
);
const SettingsPage = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.SettingsPage })),
);

const rootRoute = createRootRoute({ component: Layout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <DashboardPage />
    </Suspense>
  ),
});

const holdingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/holdings",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <HoldingsPage />
    </Suspense>
  ),
});

const recommendationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/recommendations",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <RecommendationsPage />
    </Suspense>
  ),
});

const riskRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/risk",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <RiskPage />
    </Suspense>
  ),
});

const taxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tax",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <TaxPage />
    </Suspense>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <SettingsPage />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  holdingsRoute,
  recommendationsRoute,
  riskRoute,
  taxRoute,
  settingsRoute,
]);

const hashHistory = createHashHistory();

const router = createRouter({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
