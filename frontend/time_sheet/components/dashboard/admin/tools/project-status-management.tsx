import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAppSelector } from "@/app/redux/store";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteRequests, postRequests } from "@/server/base/base_requests";
import { add_project_status, remove_project_status } from "@/app/redux/features/admin-site";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {useAppContext} from "@/context/index";
import { Trash } from "lucide-react";

export default function ProjectStatus() {
     const adminData = useAppSelector((state) => state.AdminStore);
     const [projectStatus, setProjectStatus] = useState("");
     const dispatch = useDispatch();
     const {token} = useAppContext();
     const {mutate:createStatus} = useMutation({
          mutationKey: ["create-status"],
          mutationFn: async () => {
            const response = await postRequests({
              url: "project_status/",
              token: token || "",
              data: {title: projectStatus, description: projectStatus}
            });
            dispatch(add_project_status(response));
            toast.success("Project Status Created");
        }});
     
     return (
          <div className="flex flex-col justify-center items-start px-4 py-2 bg-black rounded-xl gap-2 w-full">
          <label htmlFor="">Project Status</label>
          <div className="flex flex-row gap-2 justify-between items-center my-5">
            <input className="min-h-10 h-full"  type="text" placeholder="Create Project Status" onChange={(e)=>{
              setProjectStatus(e.target.value)
            }} />
            <Button onClick={(e)=>{
              createStatus();
            }}>
              Create
            </Button>
          </div>
          <Separator />
          <ScrollArea className="w-full h-40">
            {
              adminData.project_statuses.map((status) => (
                <div key={status.id} className="flex flex-col justify-between items-start gap-2 my-2">
                  <div className="flex flex-row justify-between items-center w-full px-2">
                    <h1>{status.title}</h1>
                    <button onClick={(e) => {
                      toast.promise(
                        deleteRequests({
                          url: `project_status/${status.id}/`,
                          token: token || "",
                        }),
                        {
                          loading: "Deleting...",
                          success: ()=>{
                            dispatch(remove_project_status(status.id));
                            return "Deleted";
                          },
                          error: "Failed to delete"
                        }
                      )
                    }}>
                      <Trash size={20}  className="text-red-600 hover:text-white transition-all duration-300"/>
                    </button>
                  </div>
                  <Separator />
                </div>
              ))
            }
          </ScrollArea>
        </div>
     )
}