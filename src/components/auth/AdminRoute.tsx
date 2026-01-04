import { useRole } from "@/hooks/useRole";
import { Navigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminRouteProps {
    children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
    const { isAdmin, loading } = useRole();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Skeleton className="h-64 w-96" />
            </div>
        );
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
}