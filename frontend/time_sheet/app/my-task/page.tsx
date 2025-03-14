"use client"

import { getRequests } from "@/server/base/base_requests"
import { useQuery } from "@tanstack/react-query"
import { useAppContext } from "@/context"
import { FullTask } from "@/types/pages"
import TaskBox from "@/components/pages/task-box"

export default function Page(){
     const {token} = useAppContext()
     const {data , isLoading, isError} = useQuery({
          queryKey:["my_tasks"],
          queryFn: async () => {
               const res = await getRequests({
                    url: `pages/my_tasks`,
                    token:token || "",
               })
               return res as FullTask[]
          }
     })
     
     return (
          <div className="flex flex-row gap-2 items-start justify-start w-full p-2 flex-wrap">
               {
                    isLoading ? (
                         <h1>Loading...</h1>
                    ) : isError ? (
                         <h1>Error...</h1>
                    ) : data && (
                         data.map((task , index) => (
                              <TaskBox key={index} task={task} index={index} />
                         ))
                    )
               }
          </div>
     )
}