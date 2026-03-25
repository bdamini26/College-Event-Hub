import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";

import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function ProtectedAdmin() {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-2xl font-bold text-destructive">Access Denied</p>
        <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        <a href="/" className="text-primary hover:underline">← Go Home</a>
      </div>
    );
  }

  return <Admin />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetail} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/about" component={About} />
      <Route path="/admin" component={ProtectedAdmin} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
