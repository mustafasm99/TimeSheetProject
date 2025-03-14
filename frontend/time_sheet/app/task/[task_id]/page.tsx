"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery , useMutation } from "@tanstack/react-query";
import { getRequests } from "@/server/base/base_requests";
import { useAppContext } from "@/context";
import { TaskPageResponse } from "@/types/tasks";
import { useState, useEffect } from "react";
import GetDateString from "@/components/util/return_date_string";
import TeamMembersHolder from "@/components/pages/team-members-holder";
import { PlayCircle, StopCircle } from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [isCounting, setIsCounting] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const { task_id } = useParams();
  const { token } = useAppContext();

  const { data, isLoading, error } = useQuery({
    queryKey: ["task", task_id],
    queryFn: async () => {
      const res: TaskPageResponse = await getRequests({
        url: `pages/task/${task_id}`,
        token: token || "",
      });

      const start = new Date(res.current_counter_time.start_time);
      const end = res.current_counter_time.end_time
        ? new Date(res.current_counter_time.end_time)
        : null;

      // If the task is currently running, start from `start_time`
      if (res.current_counter_time.is_counting) {
        setIsCounting(true);
        setStartTime(start);
        setElapsedTime(Math.floor((Date.now() - start.getTime()) / 1000));
      } else if (end) {
        // If task is stopped, count the total elapsed time until `end_time`
        setIsCounting(false);
        setElapsedTime(Math.floor((end.getTime() - start.getTime()) / 1000));
      }
      return res;
    },
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isCounting) {
      interval = setInterval(() => {
        setElapsedTime((prevElapsed) => prevElapsed + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCounting]);

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  }

  if (!data) return null;

  return (
    <div className="flex flex-col justify-center items-center min-h-[700px]">
      <div className="min-w-[500px] min-h-[500px] bg-blue-900 rounded-lg shadow-md p-4 flex flex-col gap-2 items-center justify-around">
        <div className="flex flex-row w-full justify-between items-center">
          <h1 className="font-bold text-black text-xl capitalize">
            {GetDateString(data.task.start_time.toString())}
          </h1>
          <h1 className="font-bold text-black text-xl capitalize">
            {GetDateString(data.task.end_time.toString())}
          </h1>
        </div>

        <h1 className="text-xl font-bold capitalize text-fontColor">
          {data.task.title}
        </h1>
        <h1 className="text-sm font-bold capitalize text-fontColor">
          {data.task.description.length < 50
            ? data.task.description
            : data.task.description.slice(0, 50) + "..."}
        </h1>

        <div className="flex flex-col w-full justify-center items-center">
          <button
            onClick={() => setIsCounting(!isCounting)}
            className="font-bold px-4 py-2 rounded-lg"
          >
            {isCounting ? (
              <StopCircle size="lg" className="h-20 w-20" />
            ) : (
              <PlayCircle size="lg" className="h-20 w-20" />
            )}
          </button>
          <h1>{formatTime(elapsedTime)}</h1>
        </div>

        <div className="flex flex-row gap-2 items-center justify-between w-full">
          <h3 className="text-md font-bold capitalize text-black">
            {data.task_status.status}
          </h3>
          <TeamMembersHolder
            showMembers={4}
            team_members={data.task_assignees || []}
          />
        </div>
      </div>
    </div>
  );
}
