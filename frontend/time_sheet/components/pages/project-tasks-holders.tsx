import { ProjectPageResponse } from "@/types/pages";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import TaskBox from "./task-box";
export default function ProjectTaskHolder({
  data,
}: {
  data: ProjectPageResponse;
}) {
  return (
    <div className="flex flex-row flex-wrap gap-4 items-start justify-around">
      {data.task_status.map((status, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 items-start justify-start min-w-[300px] bg-widgetsColor p-2 rounded-lg"
        >
          <div className={`flex flex-row justify-start items-center gap-2 `}>
            <h1 className="text-md font-bold capitalize text-fontColor">
              {status.status}
            </h1>
            <h1 className="flex items-center justify-center p-3 text-md font-bold capitalize text-fontColor w-5 h-5 border-2 border-white rounded-full">
              {
                data.tasks.filter((task) => task.task_status.id === status.id)
                  .length
              }
            </h1>
          </div>
          <ScrollArea className="h-[400px]">
            <div className="flex flex-col gap-2 items-start justify-start">
              {data.tasks
                .filter((task) => task.task_status.id === status.id)
                .map((task, index) => (
                  <TaskBox key={index} task={task} index={index} />
                ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}
