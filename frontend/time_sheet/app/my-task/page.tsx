"use client"

import { getRequests } from "@/server/base/base_requests"
import { useQuery } from "@tanstack/react-query"
import { useAppContext } from "@/context"
import { FullTask } from "@/types/pages"
import TaskBox from "@/components/pages/task-box"
import { useDispatch } from "react-redux"
import { setTasks   } from "@/app/redux/features/my-tasks"
import { useAppSelector } from "../redux/store"


export default function Page(){
     const {token} = useAppContext()
     const dispatch = useDispatch()
     const tasks = useAppSelector(state => state.MyTasksReducer.tasks)
     const {data , isLoading, isError} = useQuery({
          queryKey:["my_tasks"],
          queryFn: async () => {
               const res:FullTask[] = await getRequests({
                    url: `pages/my_tasks`,
                    token:token || "",
               })
               dispatch(setTasks(res))
               return res
          }
     })
     
     return (
          <div className="flex flex-row gap-2 items-start justify-start w-full p-2 flex-wrap">
               {
                    isLoading ? (
                         <h1>Loading...</h1>
                    ) : isError ? (
                         <h1>Error...</h1>
                    ) : tasks && (
                         tasks.map((task , index) => (
                              <TaskBox key={index} task={task} index={index} />
                         ))
                    )
               }
          </div>
     )
}