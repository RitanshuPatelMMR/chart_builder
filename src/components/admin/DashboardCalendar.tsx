import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export function DashboardCalendar() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Calendar
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-4">
                <div className="w-fit">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border-0 p-0"
                        classNames={{
                            months: "flex flex-col",
                            month: "space-y-2",
                            caption: "flex justify-center pt-1 relative items-center",
                            caption_label: "text-sm font-medium",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-auto border-collapse",
                            head_row: "flex",
                            head_cell: "text-slate-500 rounded-md w-8 font-normal text-[0.8rem] dark:text-slate-400",
                            row: "flex w-full mt-1",
                            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                            day: "h-8 w-8 p-0 font-normal hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md",
                            day_selected: "bg-slate-900 text-slate-50 hover:bg-slate-900 hover:text-slate-50 dark:bg-slate-50 dark:text-slate-900",
                            day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
                            day_outside: "text-slate-500 opacity-50 dark:text-slate-400",
                            day_disabled: "text-slate-500 opacity-50 dark:text-slate-400",
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    );
}