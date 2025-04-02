import {set, z} from "zod";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {postRequests} from "@/server/base/base_requests";
import {useDispatch} from "react-redux";
import {useAppContext} from "@/context";
import {add_user} from "@/app/redux/features/admin-site";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
     Select,
     SelectContent,
     SelectGroup,
     SelectItem,
     SelectLabel,
     SelectTrigger,
     SelectValue,
   } from "@/components/ui/select";
import { useAppSelector } from "@/app/redux/store";
import { Button } from "@/components/ui/button";
import { UserType } from "@/types/user";



const UserSchema = z.object({
     name: z.string().max(100 , "max length for the name is : 100").min(3 , "min length for the name is : 3"),
     email: z.string().email(), /// @ .com
     password: z.string().min(8 , "min length for the password is : 8"),
     is_superuser: z.boolean(),
     team_id: z.number(),
     is_temp_password: z.boolean(),
     is_active: z.boolean(),
});

export default function UserManager(){
     const {token} = useAppContext();
     const dispatch = useDispatch();
     const [user, setUser] = useState<z.infer<typeof UserSchema>>({
          name: "",
          email: "",
          password: "",
          is_superuser: false,
          team_id: 0,
          is_temp_password: false,
          is_active: true,
     });
     const AdminData = useAppSelector((state)=>state.AdminStore);
     const {mutate} = useMutation({
          mutationKey:["create-user"],
          mutationFn: async ()=>{
               const formResult = UserSchema.safeParse(user);
               if(formResult.success === false){
                    formResult.error.errors.map((error)=>{
                         toast.error(error.message);
                    });
                    return;
               }
               const response = await postRequests({
                    url: "user/",
                    token: token as string,
                    data: user,
               });
               dispatch(add_user(response as UserType));
               toast.success("User Created");
               setUser({
                    name: "",
                    email: "",
                    password: "",
                    is_superuser: false,
                    team_id: 0,
                    is_temp_password: false,
                    is_active: true,
               });
               return response;
          },
     })
     return(
          <form 
          onSubmit={(e)=>{
               e.preventDefault();
               mutate();
          }}
          className="flex flex-col gap-4 max-w-96  rounded-lg px-4 py-6 text-green-100 bg-gradient-to-r from-green-950  to-green-800">
               <h1 className="text-2xl font-bold min-w-96">Create User</h1>
               <Label>
                    Name
               </Label>
               <Input 
               className="bg-green-100 text-black"
               placeholder="Enter new Employ Name" 
               value={user.name}
               onChange={(e)=>{
                    setUser({...user, name: e.target.value});
               }}>
               </Input>
               <Label>
                    Email
               </Label>
               <Input
               value={user.email}
               className="bg-green-100 text-black"
               placeholder="Enter new Employ Email" 
               onChange={(e)=>{
                    setUser({...user, email: e.target.value});
               }}>
               </Input>
               <Label>
                    Password
               </Label>
               <Input
               value={user.password}
               className="bg-green-100 text-black" 
               placeholder="Enter new Employ Password" 
               onChange={(e)=>{
                    setUser({...user, password: e.target.value});
               }}>
               </Input>
               <div className="flex flex-row w-full gap-4">
                    <input type="checkbox"
                    checked={user.is_superuser}
                    value={user.is_superuser.toString()}
                    onChange={(e)=>{
                         setUser({...user, is_superuser: e.target.checked});
                    }}>
                    </input>
                    <Label>
                         Is Admin
                    </Label>
               </div>
               <div className="flex flex-row w-full gap-4">
                    <input type="checkbox" 
                    value={user.is_temp_password.toString()}
                    checked={user.is_temp_password}
                    onChange={(e)=>{
                         setUser({...user, is_temp_password: e.target.checked});
                    }}>
                    </input>
                    <Label>
                         Is Temp Password
                    </Label>
               </div>
               <Label>
                    Team
               </Label>
               <Select
                    onValueChange={(value)=>{
                         setUser({...user, team_id: parseInt(value)});
                    }}
                    value={user.team_id.toString()}
               >
                    <SelectTrigger className="bg-green-100 text-black">
                         <SelectValue placeholder="select team for the user"/>
                    </SelectTrigger>
                    <SelectContent className="bg-green-100 text-black">
                         <SelectGroup>
                              {
                                   AdminData.teams.map((team)=>{
                                        return(
                                             <SelectItem 
                                             key={team.id} 
                                             value={team.id.toString() || ""}
                                             >
                                                  <SelectLabel>
                                                       {team.name}
                                                  </SelectLabel>
                                             </SelectItem>
                                        )
                                   })
                              }
                         </SelectGroup>
                    </SelectContent>
               </Select>
               <Button type="submit">
                    Create User
               </Button>
          </form>
     )
};