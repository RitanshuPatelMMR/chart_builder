import { format } from "date-fns";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { mockPayments } from "@/data/mockAdminData";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusStyles = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const planLabels = {
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

export default function AdminPayments() {
  return (
    <>
      <AdminHeader
        title="Payments"
        subtitle="View and manage payment transactions"
      />
      <main className="flex-1 p-6">
        <div className="rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 hover:bg-transparent dark:border-slate-800">
                <TableHead className="text-slate-500 dark:text-slate-400">User</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400">Plan</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400">Amount</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400">Transaction ID</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400">Status</TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                mockPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="border-slate-200 dark:border-slate-800"
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {payment.userName}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {payment.userEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300"
                      >
                        {planLabels[payment.plan]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                      ${payment.amount}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-slate-500 dark:text-slate-400">
                      {payment.transactionId}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[payment.status]}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 dark:text-slate-400">
                      {format(new Date(payment.date), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}
