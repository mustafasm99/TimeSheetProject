"use client";

import Calendar from "@/components/pages/calendar";
import TaskBox from "@/components/pages/task-box";
import { useAppContext } from "@/context";
import { getRequests } from "@/server/base/base_requests";
import { FullTask } from "@/types/pages";
import { useQuery } from "@tanstack/react-query";
import {
  differenceInDays,
  format,
  isSameDay,
  isWithinInterval,
} from "date-fns";

export default function Page() {
  const { token } = useAppContext(); 
  const { data, isLoading } = useQuery({
    queryKey: ["my_tasks"],
    queryFn: async () => {
      const res = await getRequests({
        url: `pages/my_tasks`,
        token: token || "",
      });
      return res as FullTask[];
    },
  });
  let occupiedRows: Record<number, { start: Date; end: Date }> = {}
  if (isLoading) return <h1>Loading...</h1>;
  // console.log(data);
  if (data && token) {
    return (
      <div className="w-full h-fit">
        <Calendar>
          {(day, ref) => {
            const formattedDay = format(day, "yyyy-MM-dd");

            // Track multiple tasks in the same cell
            let tasksForThisDay = data.filter((task) => {
              if (isSameDay(day, new Date(task.task.start_time))) return true;
            });
            

            return (
              <div className="relative">
                {tasksForThisDay.map((task) => {
                  const startDate = new Date(task.task.start_time);
                  const endDate = new Date(task.task.end_time);
                  let taskDuration = differenceInDays(endDate, startDate) + 1;

                  let row = 0;
                  while (row in occupiedRows && isWithinInterval(startDate, occupiedRows[row])) {
                    row++;
                  }
                  occupiedRows[row] = { start: new Date(task.task.start_time), end: new Date(task.task.end_time) }; // Mark this row as occupied

                  // Ensure task is only rendered in its start column
                  if (!isSameDay(day, startDate)) return null;
                  return (
                    <div
                      key={task.task.id}
                      ref={ref}
                      className="absolute text-white text-xs p-2 rounded-lg overflow-hidden z-10 hover:z-50"
                      style={{
                        left: "0%", // Always start at the left of the first column
                        width: `${taskDuration * 380}px`,
                        top: `${row * 180}px`, // Push down if multiple tasks exist
                      }}
                    >
                      <TaskBox
                        task={task}
                        index={task.task.id ?? 0}
                        className="hover:shadow-lg flex flex-col gap-2 items-start justify-start w-full p-2 bg-widgetsColor rounded-lg hover:z-999"
                      />
                    </div>
                  );
                })}
              </div>
            );
          }}
        </Calendar>
      </div>
    );
  }
  else return <div className="w-screen h-screen flex justify-center items-center">
    <h1 className="text-3xl">
      Error unauthorized user
    </h1>
  </div>;
}
