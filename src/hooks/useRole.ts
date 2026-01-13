import { useUser, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

export function useRole() {
    const { user, isLoaded } = useUser();
    const { getToken } = useAuth(); // ← Use useAuth hook
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkRole() {
            if (!isLoaded || !user) {
                setLoading(false);
                return;
            }

            try {
                const token = await getToken();
                const res = await fetch("http://localhost:3000/api/user/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setIsAdmin(data.role === "admin");
                }
            } catch (error) {
                console.error("Failed to fetch role:", error);
            } finally {
                setLoading(false);
            }
        }

        checkRole();
    }, [user, isLoaded, getToken]);

    return { isAdmin, loading };
}