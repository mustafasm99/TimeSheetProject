import { FullTask } from "@/types/pages";
import GetDateString from "../util/return_date_string";
import { MoveRight } from "lucide-react";
import TeamMembersHolder from "./team-members-holder";

export default function TaskBox(
     {task , index}:{task:FullTask , index:number}
) {
     const task_colors = [
          "#EF4444", // bg-red-500
          "#3B82F6", // bg-blue-500
          "#10B981", // bg-green-500
          "#F59E0B", // bg-yellow-500
          "#EC4899", // bg-pink-500
          "#A855F7", // bg-purple-500
          "#6366F1", // bg-indigo-500
          "#6B7280", // bg-gray-500
          "#4B5563", // bg-gray-700
          "00A793", // bg-teal-500
        ];
  return (
    <div
      key={index}
      className={`flex flex-col gap-2 items-start justify-start w-[280px] p-2 bg-widgetsColor rounded-lg z-50`}
      style={{
        backgroundColor:
          task_colors[Math.floor(Math.random() * task_colors.length)],
      }}
    >
      <div className="flex flex-row w-full justify-between items-center">
        <h1 className="font-bold text-black text-xl capitalize">
          {GetDateString(task.task.start_time.toString())}
        </h1>
        <MoveRight className="h-5 w-5" />
      </div>
      <h1 className="text-xl font-bold capitalize text-fontColor">
        {task.task.title}
      </h1>
      <h1 className="text-sm font-bold capitalize text-fontColor">
        {task.task.description.length < 50
          ? task.task.description
          : task.task.description.slice(0, 50) + "..."}
      </h1>

      <div className="flex flex-row gap-2 items-center justify-between w-full">
        <h3 className="text-md font-bold capitalize text-black">
          {task.task_status.status}
        </h3>
        <TeamMembersHolder
          showMembers={2}
          team_members={task.task_assignees || []}
        />
      </div>
    </div>
  );
}
