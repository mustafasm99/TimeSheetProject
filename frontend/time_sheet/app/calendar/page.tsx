"use client";

import Calendar from "@/components/pages/calendar";
import TaskBox from "@/components/pages/task-box";
import { useAppContext } from "@/context";
import { getRequests } from "@/server/base/base_requests";
import { FullTask } from "@/types/pages";
import { useQuery } from "@tanstack/react-query";
import { differenceInDays, format } from "date-fns";

export default function Page() {
  const { token } = useAppContext();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my_tasks"],
    queryFn: async () => {
      const res = await getRequests({
        url: `pages/my_tasks`,
        token: token || "",
      });
      return res as FullTask[];
    },
  });

  if (isLoading) return <h1>Loading...</h1>;

  if (data)
    return (
      <Calendar>
        {(day, ref) => {
          const formattedDay = format(day, "yyyy-MM-dd");

          return (
            <>
              {data.map((task, index) => {
                const isEventDay =
                  new Date(formattedDay) >= new Date(task.task.start_time) &&
                  new Date(formattedDay) <= new Date(task.task.end_time);

                if (isEventDay) {
                  // Calculate the left and width for the event div
                  const daysBetweenStart = differenceInDays(
                    new Date(task.task.start_time),
                    new Date(formattedDay)
                  );
                  const daysBetweenEnd = differenceInDays(
                    new Date(task.task.end_time),
                    new Date(task.task.start_time)
                  );
                  const leftPosition = daysBetweenStart * 100; // You can scale the 100 value based on your calendar's width
                  const width = (daysBetweenEnd + 1) * 100;

                  return (
                    <div
                      key={index}
                      ref={ref}
                      style={{
                        position: "absolute",
                        left: `${leftPosition}%`,
                        width: `${width}%`,
                        padding: "5px",
                        borderRadius: "4px",
                      }}
                    >
                      <TaskBox index={index} task={task} />
                    </div>
                  );
                }
                return null;
              })}
            </>
          );
        }}
      </Calendar>
    );
}
