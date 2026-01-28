import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { UsersTable } from "@/components/admin/UsersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AdminUser } from "@/types/admin";
import { AlertCircle } from "lucide-react";
import { API_ENDPOINTS } from "@/config/api";

export default function AdminUsers() {
    const { getToken } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                console.log("🔄 Fetching users...");
                const token = await getToken();

                if (!token) {
                    throw new Error("No authentication token");
                }

                const res = await fetch(API_ENDPOINTS.admin.users, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("📡 Response status:", res.status);

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Failed to fetch users: ${res.status} - ${errorText}`);
                }

                const data = await res.json();
                console.log("✅ Users fetched:", data);

                setUsers(data);
                setError(null);
            } catch (err) {
                console.error("❌ Error fetching users:", err);
                setError(err instanceof Error ? err.message : "Failed to load users");
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, [getToken]);

    if (loading) {
        return (
            <>
                <AdminHeader
                    title="Users"
                    subtitle="Manage and view all registered users"
                />
                <main className="flex-1 p-6">
                    <Skeleton className="h-96 w-full rounded-lg" />
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <AdminHeader
                    title="Users"
                    subtitle="Manage and view all registered users"
                />
                <main className="flex-1 p-6">
                    <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                        <CardContent className="flex items-center gap-4 p-6">
                            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                            <div>
                                <h3 className="font-semibold text-red-900 dark:text-red-100">
                                    Failed to Load Users
                                </h3>
                                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                                    {error}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </>
        );
    }

    return (
        <>
            <AdminHeader
                title="Users"
                subtitle="Manage and view all registered users"
            />
            <main className="flex-1 p-6">
                <UsersTable users={users} />
            </main>
        </>
    );
}