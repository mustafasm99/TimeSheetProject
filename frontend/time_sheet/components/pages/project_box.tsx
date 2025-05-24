import { FullTask, ProjectBoxType } from "@/types/pages";
import {
  BookAIcon,
  BookMarked,
  Clock,
  ClockAlertIcon,
  ProjectorIcon,
  UsersRoundIcon,
} from "lucide-react";
import config from "@/settings/configer";
import TeamMembersHolder from "./team-members-holder";
import { ProjectType } from "@/types/projects";

type ProjectBoxProp = {
  data: ProjectBoxType;
  tasks: FullTask[];
  project?:ProjectType;
};

export default function ProjectBox({ data, tasks , project }: ProjectBoxProp) {

  if (!data || !data.project && !project) {
    return (
      <div className="min-w-[400px] min-h-[320px] flex flex-col gap-2 items-start justify-start px-3 py-6 bg-mainColor text-white rounded-lg shadow-md">
        <p className="text-2xl font-bold text-white">
          No Project Data Available
        </p>
      </div>
    );
  }
  // If a project prop is provided, override data.project with it (without mutating props)
  const mergedData = project ? { ...data, project } : data;

  return (
    <div className="min-w-[400px] min-h-[320px]  flex flex-col gap-2 items-start justify-start px-3 py-6 bg-mainColor text-white rounded-lg shadow-md">
      <div className="flex w-full flex-row justify-start items-center gap-5">
        <div className="w-[120px] h-[120px] bg-black rounded-lg flex justify-center items-center">
          <BookAIcon size={100} />
        </div>
        <div className="flex flex-col">
          <p className="text-2xl font-bold text-white">
            {mergedData && mergedData.project ? mergedData.project.name : ""}
          </p>
          <p>{mergedData && mergedData.project ? mergedData.team.name : ""}</p>
        </div>
      </div>
      <div className="rounded-[15px] bg-[#404348] w-fit p-2 h-[40px] flex flex-row gap-2 items-center justify-start">
        <div className="flex flex-row gap-2 bg-widgetsColor rounded-[20px] py-1 px-2">
          <BookMarked size={20} color="#ECB476" />
          <p>{tasks && tasks.length} </p>
        </div>
        <div className="flex flex-row gap-2 bg-widgetsColor rounded-[20px] py-1 px-2">
          <UsersRoundIcon size={20} color="green" />
          <p>{mergedData && mergedData.project ? mergedData.team_members.length : ""} </p>
        </div>
        <div className="flex flex-row gap-2 bg-widgetsColor rounded-[20px] py-1 px-2">
          <p>
            {new Date(
              mergedData.project.start_time
                ? new Date(mergedData.project.start_time)
                : Date.now()
            ).toLocaleString()}
          </p>
          <Clock size={20} color="white" />
        </div>
      </div>
      <p className="mt-4 flex flex-row gap-2 items-center justify-start">
        Task Done :{" "}
        {tasks.filter((task) => task.task_status.status === "done").length}/
        {tasks.length}
      </p>

      <div className="flex flex-row gap-0 justify-start items-start w-full px-0 rounded-lg h-[20px] border">
        {tasks.filter(
          (task) => task.task_status.status.toLowerCase() === "done"
        ).length > 0 && (
          <div
            className="flex flex-row justify-center items-center text-white h-full w-fit rounded-lg z-20 px-2"
            style={{
              width: `${
                (tasks.filter(
                  (task) => task.task_status.status.toLowerCase() === "done"
                ).length /
                  tasks.length) *
                100
              }%`,
              backgroundColor: "#053e00",
            }}
          >
            done
          </div>
        )}
        {tasks.filter(
          (task) => task.task_status.status.toLowerCase() !== "done"
        ).length > 0 && (
          <div
            className={`flex flex-row justify-center items-center text-white h-full w-fit rounded-r-lg px-4 relative ${
              tasks.filter((task) => task.task_status.status === "done")
                .length > 0
                ? "-left-2 z-10"
                : ""
            }`}
            style={{
              width: `${
                (tasks.filter((task) => task.task_status.status !== "done")
                  .length /
                  tasks.length) *
                100
              }%`,
              backgroundColor: "#e6a23c",
            }}
          >
            in progress
          </div>
        )}
        {tasks.filter(
          (task) => task.task_status.status.toLowerCase() === "done"
        ).length === 0 &&
          tasks.filter(
            (task) => task.task_status.status.toLowerCase() !== "done"
          ).length === 0 && (
            <div
              className="flex flex-row justify-center items-center text-white h-full w-full rounded-lg px-2"
              style={{ backgroundColor: "#5b0000" }}
            >
              No Tasks Yet
            </div>
          )}
      </div>

      <div className="flex flex-row gap-2 items-center justify-between w-full mt-2">
        <TeamMembersHolder key={1} team_members={mergedData.team_members} />
        <div className="flex flex-row gap-2 items-center justify-center bg-[#ff000025] px-5 py-4 rounded-lg">
          <h1 className="text-white font-bold">
            Due Date :{" "}
            {new Date(
              mergedData.project.end_time
                ? new Date(mergedData.project.end_time)
                : Date.now()
            ).toLocaleDateString()}
          </h1>
          <ClockAlertIcon size={20} color="red" />
        </div>
      </div>
    </div>
  );
}
