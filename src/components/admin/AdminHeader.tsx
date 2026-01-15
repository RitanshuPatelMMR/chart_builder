import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
    title: string;
    subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
    return (
        <div className="border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Link to="/dashboard">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to App
                            </Button>
                        </Link>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}