import { FullTask } from "@/types/pages"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Check, CheckIcon } from "lucide-react";

type TaskListsProps = {
     data:FullTask[];
}
export default function TaskLists(
     {
          data
     }:TaskListsProps
){

     return (
          <div className="flex flex-col gap-5 justify-start items-start bg-widgetsColor rounded-lg px-2 py-4 min-h-[320px] max-w-[450px] min-w-[400px] h-full w-full">
               <div className="flex flex-row w-full">
                    <h1 className="text-lg font-bold px-5">
                         My Tasks {`(${data.length})`}
                    </h1>
               </div>
               {
                    data.length === 0 && (
                         <div className="flex flex-col items-center justify-center w-full">
                              <h1>
                                   No tasks assigned
                              </h1>
                         </div>
                    )
               }
               <ScrollArea className="flex flex-col gap-2 w-full h-full">
                    {
                         data.map((task,index)=>(
                              <div key={index} className="flex flex-row gap-2 items-center justify-between w-full border-b-4 border-white pb-2">
                                   <div className="flex flex-row gap-2 items-center justify-start w-full">
                                        <h1 className="text-md font-semibold">
                                             {index+1 < 10 ? `0${index+1}` : index+1}
                                        </h1>
                                        <h1 className={`
                                                  text-md font-semibold
                                                  ${task.task_status.status.toLowerCase() === "done" ? "line-through text-white" : "text-white"}
                                             `}>
                                             {task.task.title}
                                        </h1>
                                   </div>
                                   <div 
                                        className={` w-[20px] h-[20px] flex flex-row items-center justify-center rounded-full ${task.task_status.status.toLowerCase() === "done" ? "bg-green-500" :"bg-gray-500"} text-white`}
                                   >
                                        <Check size={15}  color="black"/>
                                   </div>
                              </div>
                         ))
                    }
               </ScrollArea>
          </div>
     )

};