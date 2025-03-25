import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  addMonths,
  isSameMonth,
} from "date-fns";
import { ArrowBigLeft, ArrowBigRight, MoveLeftIcon, MoveRightIcon } from "lucide-react";
import { ReactNode, useRef, useEffect, useState } from "react";

interface CalendarProps {
  children?: (
    day: Date,
    ref: React.RefObject<HTMLTableCellElement>
  ) => ReactNode;
}

export default function Calendar({ children }: CalendarProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const refs = useRef<Record<string, HTMLTableCellElement | null>>({});

  useEffect(() => {
    const todayFormatted = format(today, "yyyy-MM-dd");
    if (refs.current[todayFormatted]) {
      refs.current[todayFormatted]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentMonth]);

  const goToPreviousMonth = () =>
    setCurrentMonth((prev) => addMonths(prev, -1));
  const goToNextMonth = () => setCurrentMonth((prev) => addMonths(prev, 1));

  return (
    <div className="w-full h-screen flex flex-col items-start justify-start relative rounded-lg">
      <div className="flex justify-between items-center w-full p-4 rounded-t-lg">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-gray-300 rounded text-black font-bold flex flex-row justify-center items-center gap-2"
        >
          <ArrowBigLeft size={20} fill={"black"} />
            <h3>{format(addMonths(currentMonth, -1), "MMMM")}</h3>
        </button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-gray-300 rounded text-black flex flex-row justify-center items-center gap-2 font-bold"
        >
          <h3>{format(addMonths(currentMonth, +1), "MMMM")}</h3>
          <ArrowBigRight size={20} fill={"black"} />
        </button>
      </div>
      <ScrollArea className="w-full h-full overflow-x-auto rounded-lg">
        <table className="border-collapse border border-gray-300 text-black w-full h-screen relative">
          <thead>
            <tr>
              {daysInMonth.map((day) => (
                <th
                  key={day.getTime()}
                  className="border border-gray-300 p-2 bg-gray-100 min-w-[380px] text-center"
                >
                  {format(day, "EEEE")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="h-32 min-h-full">
              {daysInMonth.map((day) => {
                const formattedDay = format(day, "yyyy-MM-dd");

                return (
                  <td
                    key={day.getTime()}
                    ref={(el) => {
                      refs.current[formattedDay] = el;
                    }}
                    className={`border border-gray-300 p-2 align-top text-center justify-start relative ${
                      isSameMonth(day, currentMonth)
                        ? "bg-white"
                        : "bg-gray-200"
                    } ${
                      formattedDay === format(today, "yyyy-MM-dd")
                        ? "bg-blue-200"
                        : ""
                    }`}
                  >
                    {isSameMonth(day, currentMonth) && (
                      <div className="font-bold">{format(day, "dd")}</div>
                    )}
                    <div className="mt-2">
                      {children?.(day, { current: refs.current[formattedDay] })}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
