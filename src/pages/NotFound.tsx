import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 flex items-center justify-center">
          <div className="container max-w-md text-center px-4">
            {/*<h1 className="text-9xl font-bold text-primary mb-4">404</h1>*/}
            <h2 className="text-2xl font-semibold mb-3">Page Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The page you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/")} size="lg">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </main>

        <Footer />
      </div>
  );
};

export default NotFound;