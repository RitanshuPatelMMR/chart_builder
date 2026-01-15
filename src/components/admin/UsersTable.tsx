import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Search, Eye, ArrowUp, ArrowDown } from "lucide-react";
import { AdminUser } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";

interface UsersTableProps {
  users: AdminUser[];
}

export function UsersTable({ users }: UsersTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  if (!users || !Array.isArray(users)) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-slate-500">No users data available</p>
        </div>
    );
  }
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "upgrade" | "downgrade";
    user: AdminUser | null;
  }>({ open: false, action: "upgrade", user: null });

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === "all" || user.plan === planFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesPlan && matchesRole;
  });

  const handleAction = (action: "upgrade" | "downgrade", user: AdminUser) => {
    setConfirmDialog({ open: true, action, user });
  };

  const confirmAction = () => {
    if (confirmDialog.user) {
      toast({
        title: `User ${confirmDialog.action === "upgrade" ? "upgraded" : "downgraded"}`,
        description: `${confirmDialog.user.name} has been ${
          confirmDialog.action === "upgrade" ? "upgraded to Premium" : "downgraded to Free"
        }.`,
      });
    }
    setConfirmDialog({ open: false, action: "upgrade", user: null });
  };

  const getRoleBadge = (role: AdminUser["role"]) => {
    return role === "admin" ? (
      <Badge className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900">
        Admin
      </Badge>
    ) : (
      <Badge variant="secondary">User</Badge>
    );
  };

  const getPlanBadge = (plan: AdminUser["plan"]) => {
    return plan === "premium" ? (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
        Premium
      </Badge>
    ) : (
      <Badge variant="outline">Free</Badge>
    );
  };

  const getStatusBadge = (status: AdminUser["status"]) => {
    const styles = {
      active: "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400",
      inactive: "border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400",
      suspended: "border-red-300 text-red-700 dark:border-red-700 dark:text-red-400",
    };
    return (
      <Badge variant="outline" className={cn("capitalize", styles[status])}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <div className="flex gap-2">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[130px] border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[130px] border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
              <TableHead className="text-slate-500 dark:text-slate-400">User</TableHead>
              <TableHead className="text-slate-500 dark:text-slate-400">Role</TableHead>
              <TableHead className="text-slate-500 dark:text-slate-400">Plan</TableHead>
              <TableHead className="text-slate-500 dark:text-slate-400">Status</TableHead>
              <TableHead className="text-slate-500 dark:text-slate-400">Joined</TableHead>
              <TableHead className="text-right text-slate-500 dark:text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="border-slate-200 dark:border-slate-800"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {user.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {user.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getPlanBadge(user.plan)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-400">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/users/${user.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/*{user.plan === "free" ? (*/}
                        {/*  <DropdownMenuItem onClick={() => handleAction("upgrade", user)}>*/}
                        {/*    <ArrowUp className="mr-2 h-4 w-4" />*/}
                        {/*    Upgrade to Premium*/}
                        {/*  </DropdownMenuItem>*/}
                        {/*) : (*/}
                        {/*  <DropdownMenuItem onClick={() => handleAction("downgrade", user)}>*/}
                        {/*    <ArrowDown className="mr-2 h-4 w-4" />*/}
                        {/*    Downgrade to Free*/}
                        {/*  </DropdownMenuItem>*/}
                        {/*)}*/}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ ...confirmDialog, open })
        }
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
              <span className="font-medium">{confirmDialog.user?.name}</span>?
              {confirmDialog.action === "upgrade"
                ? " They will gain access to premium features."
                : " They will lose access to premium features."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
