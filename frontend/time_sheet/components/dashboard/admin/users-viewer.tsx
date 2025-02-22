import { useAppSelector } from "@/app/redux/store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { deleteRequests, putRequests } from "@/server/base/base_requests"
import config from "@/settings/configer"
import toast from "react-hot-toast"
import { useAppContext } from "@/context"
import { useDispatch } from "react-redux"
import { remove_user } from "@/app/redux/features/admin-site"


export default function UserViewer(){
     const dispatch = useDispatch()
     const adminData = useAppSelector(state => state.AdminStore)
     const {token} = useAppContext()     
     return (
          <div className="flex flex-col justify-start items-start w-fit py-4 bg-white rounded-lg max-h-[320px]">
               <h1 className="text-black text-lg font-semibold w-full px-2 py-2">
                    All Users
               </h1>
               <ScrollArea className="w-full  overflow-y-auto">   
               {
                    adminData.users.map((user) => {
                         return (
                              <div key={user.id} className="text-black flex flex-row justify-between items-center w-full px-2 py-2 bg-gray-100 rounded-lg mb-2">
                                   <div className="flex flex-row justify-start items-center">
                                        <div className="flex flex-row justify-center items-center w-12 h-12 bg-gray-200 rounded-full">
                                             {
                                                  user.image ? <img src={config().API_URL + user.image} alt="user" className="w-10 h-10 rounded-full" /> : <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                                             }
                                        </div>
                                        <div className="flex flex-col justify-start items-start ml-2">
                                             <div className="text-lg font-semibold">{user.name}</div>
                                             <div className="text-sm font-light">{user.email}</div>
                                        </div>
                                   </div>
                                   <div className="flex flex-row justify-start items-center">
                                        <div className="flex flex-col justify-start items-start">
                                             <div className="text-sm font-semibold">Role</div>
                                             <div className="text-sm font-semibold text-black" >{user.roll}</div>
                                        </div>
                                        <div className="flex flex-col justify-start items-start ml-4">
                                             <div className="text-sm font-semibold">Team</div>
                                             <div className="text-sm ">{user.team_name}</div>
                                             
                                        </div>
                                   </div>
                                   <div className="flex flex-col gap-2 justify-between items-center">
                                        <Button className="w-full bg-red-500 text-white hover:bg-white hover:text-red-500"
                                             onClick={async () => {

                                                  toast.promise(
                                                       putRequests({
                                                            url:"user/deactivate/" + user.id,
                                                            token: token as string,
                                                       }),
                                                       {
                                                            loading: "Deactivating user",
                                                            success: ()=>{
                                                                 dispatch(remove_user(user.id))
                                                                 return "User deactivated"
                                                            },
                                                            error: "Failed to deactivate user"
                                                       }
                                                  )
                                             }}
                                             
                                        >
                                             deactivate
                                        </Button>
                                        <Button className="w-full bg-black text-white hover:bg-white hover:text-black"
                                             onClick={async () => {
                                                  
                                                  toast.promise(
                                                       deleteRequests({
                                                            url: "user/" + user.id,
                                                            token: token as string,
                                                       }),
                                                       {
                                                            loading: "Deactivating user",
                                                            success: ()=>{
                                                                 dispatch(remove_user(user.id))
                                                                 return "User deactivated"
                                                            },
                                                            error: "Failed to deactivate user"
                                                       }
                                                  )
                                             }}
                                        >
                                             delete
                                        </Button>
                                   </div>
                              </div>
                         )
                    })
               }
               </ScrollArea>
          </div>
     )
}