import { useAppSelector } from "@/app/redux/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import config from "@/settings/configer"
export default function UserViewer(){
     
     const adminData = useAppSelector(state => state.AdminStore)
     // Todo : Fix images form the backend
     return (
          <div className="flex flex-col justify-start items-start w-fit px-2 py-4 bg-white rounded-lg ">
               <ScrollArea className="w-full h-50 overflow-y-auto">   
               {
                    adminData.users.map((user) => {
                         return (
                              <div className="text-black flex flex-row justify-between items-center w-full px-2 py-2 bg-gray-100 rounded-lg mb-2">
                                   <div className="flex flex-row justify-start items-center">
                                        <div className="flex flex-row justify-center items-center w-12 h-12 bg-gray-200 rounded-full">
                                             <img src={config().API_URL + "/profile" + user.image} alt="" className="h-full w-full object-fit"/>
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
                              </div>
                         )
                    })
               }
               </ScrollArea>
          </div>
     )
}