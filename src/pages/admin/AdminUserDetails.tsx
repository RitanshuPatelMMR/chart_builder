import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BarChart3, Calendar, Mail, Shield, CreditCard } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getUserById } from "@/data/mockAdminData";
import { cn } from "@/lib/utils";

export default function AdminUserDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "upgrade" | "downgrade";
  }>({ open: false, action: "upgrade" });

  const user = id ? getUserById(id) : undefined;

  if (!user) {
    return (
      <>
        <AdminHeader title="User Not Found" />
        <main className="flex flex-1 flex-col items-center justify-center p-6">
          <p className="mb-4 text-slate-500">The user you're looking for doesn't exist.</p>
          <Button variant="outline" onClick={() => navigate("/admin/users")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </main>
      </>
    );
  }

  const handleAction = (action: "upgrade" | "downgrade") => {
    setConfirmDialog({ open: true, action });
  };

  const confirmAction = () => {
    toast({
      title: `User ${confirmDialog.action === "upgrade" ? "upgraded" : "downgraded"}`,
      description: `${user.name} has been ${
        confirmDialog.action === "upgrade" ? "upgraded to Premium" : "downgraded to Free"
      }.`,
    });
    setConfirmDialog({ open: false, action: "upgrade" });
  };

  const getStatusStyles = (status: typeof user.status) => {
    const styles = {
      active: "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400",
      inactive: "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400",
      suspended: "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400",
    };
    return styles[status];
  };

  return (
    <>
      <AdminHeader title="User Details" subtitle={user.email} />
      <main className="flex-1 p-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/users")}
          className="mb-6 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:col-span-1">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback className="bg-slate-100 text-xl text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {user.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {user.email}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {user.role === "admin" ? (
                    <Badge className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
                      Admin
                    </Badge>
                  ) : (
                    <Badge variant="secondary">User</Badge>
                  )}
                  {user.plan === "premium" ? (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Premium
                    </Badge>
                  ) : (
                    <Badge variant="outline">Free</Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={cn("capitalize", getStatusStyles(user.status))}
                  >
                    {user.status}
                  </Badge>
                </div>
              </div>

              <Separator className="my-6 bg-slate-200 dark:bg-slate-800" />

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300">
                    Joined {new Date(user.joinedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-300 capitalize">
                    {user.role} role
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Actions */}
          <div className="space-y-6 lg:col-span-2">
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                    <BarChart3 className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {user.chartsCount}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Charts Created
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
                    <CreditCard className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize">
                      {user.plan}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Current Plan
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admin Actions */}
            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                  Admin Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex gap-3">
                {user.plan === "free" ? (
                  <Button onClick={() => handleAction("upgrade")}>
                    Upgrade to Premium
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => handleAction("downgrade")}>
                    Downgrade to Free
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CreditCard className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    No payment history
                  </h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Payment records will appear here once payment integration is completed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <AlertDialog
          open={confirmDialog.open}
          onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {confirmDialog.action === "upgrade"
                  ? "Upgrade to Premium"
                  : "Downgrade to Free"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {confirmDialog.action}{" "}
                <span className="font-medium">{user.name}</span>?
                {confirmDialog.action === "upgrade"
                  ? " They will gain access to premium features."
                  : " They will lose access to premium features."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  );
}
