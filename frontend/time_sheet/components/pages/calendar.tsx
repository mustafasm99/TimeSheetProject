import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addWeeks,
  isSameMonth,
} from "date-fns";
import { ReactNode, useRef, useEffect, useState } from "react";

interface CalendarProps {
  children?: (day: Date, ref: React.RefObject<HTMLTableCellElement>) => ReactNode;
}

export default function Calendar({ children }: CalendarProps) {
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  // Get all weeks of the current month
  let weeks = [];
  let start = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  while (start <= monthEnd) {
    const end = endOfWeek(start, { weekStartsOn: 1 });
    weeks.push({ start, end });
    start = addWeeks(start, 1);
  }

  return (
    <div className="max-w-[100%] h-screen flex flex-col items-start justify-start p-4 relative">
      <ScrollArea className="w-full h-full overflow-x-auto">
        <table className="border-collapse border border-gray-300 text-black w-full h-full relative">
          <thead>
            <tr>
              {eachDayOfInterval({
                start: startOfWeek(today, { weekStartsOn: 1 }),
                end: endOfWeek(today, { weekStartsOn: 1 }),
              }).map((day) => (
                <th
                  key={day.getTime()}
                  className="border border-gray-300 p-2 bg-gray-100 min-w-[50px] text-center"
                >
                  {format(day, "EEEE")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map(({ start, end }, index) => (
              <tr key={index} className="h-32 min-h-20">
                {eachDayOfInterval({ start, end }).map((day) => {
                  const formattedDay = format(day, "yyyy-MM-dd");
                  const ref = useRef<HTMLTableCellElement>(null);

                  return (
                    <td
                      key={day.getTime()}
                      ref={ref}
                      className={`border border-gray-300 p-2 text-center relative ${
                        isSameMonth(day, today) ? "bg-white" : "bg-gray-200"
                      } ${formattedDay === format(today, "yyyy-MM-dd") ? "bg-blue-200" : ""}`}
                    >
                      {/* Show the date number only once */}
                      {isSameMonth(day, today) && (
                        <div className="font-bold">{format(day, "dd")}</div>
                      )}
                      <div className="mt-2">{children?.(day, ref)}</div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
