import { UserType } from "@/types/user";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { postRequests } from "@/server/base/base_requests";
import { useAppContext } from "@/context";
import {z} from "zod";
import { useState } from "react";
import toast from "react-hot-toast";


type prop = {
  user: UserType;
};


const ProfileSchema = z.object({
     bio: z.string(),
     image: z.instanceof(File)
});

const PasswordSchema = z.object({
     old_password: z.string().min(7 , "the password is too short"),
     new_password: z.string().min(7 , "the password is too short"),
     confirm_password: z.string().min(7, "the password is too short"),
});

export default function FinishUserInfo({ user }: prop) {
     const {token} = useAppContext();
     const [profile, setProfile] = useState<z.infer<typeof ProfileSchema>>({
          bio:"",
          image:new File([], "")
     });
     const [password, setPassword] = useState<z.infer<typeof PasswordSchema>>({
          old_password:"",
          new_password:"",
          confirm_password:""
     });
     
     return (
    <div className="flex flex-row w-full justify-between items-center gap-4">
      {user.is_temp_password && (
        <div className="flex flex-col w-full min-h-96 justify-center items-start gap-4 rounded-lg bg-white px-8">
          <h1 className="font-bold text-black capitalize ">
            your password is temporary you need to create new one
          </h1>
          <form 
          action="" 
          onSubmit={(e)=>{
               e.preventDefault();
               const parsForm = PasswordSchema.safeParse(password);
               if (!parsForm.success) {
                    parsForm.error.errors.map((error)=>toast.error(error.message));
                    return;
               }
               const response = postRequests({
                    url:"auth/change_password",
                    token:token || "",
                    data:password,
               });
               toast.success("Password Changed Successfully");
               
          }}
          className="w-full flex flex-col gap-4 justify-center items-start my-5">
               <Label className="text-black ">Enter your Old Password</Label>
               <Input type="text" className="bg-mainColor" onChange={
                    (e)=>setPassword({...password, old_password:e.target.value})
               } />
               <Label className="text-black ">Enter your New Password</Label>
               <Input
                    onChange={
                         (e)=>setPassword({...password, new_password:e.target.value})
                    }
                    className="bg-mainColor"
                    type="password"
               />
               <Label className="capitalize text-black">reenter your password</Label>
               <Input
                    onChange={
                         (e)=>setPassword({...password, confirm_password:e.target.value})
                    }
                    className="bg-mainColor"
                    type="password"
               />
               <Button className="bg-mainColor text-white hover:bg-black">
                    Create New Password
               </Button>
          </form>
        </div>
      )
      }
      {
          user.have_profile == false && (
               <div className="flex flex-col w-full min-h-96 justify-center items-start gap-4 rounded-lg bg-blue-900 px-8">
                    <h1 className="font-bold capitalize text-2xl">
                         Create Your Profile
                    </h1>
                    <form 
                         encType="multipart/form-data"
                         action="" 
                         className="flex flex-col w-full gap-4 my-4"
                         onSubmit={(e)=>{
                              e.preventDefault()
                              const form = new FormData();
                              const parsForm = ProfileSchema.safeParse(profile);
                              if (!parsForm.success) {
                                   parsForm.error.errors.map((error)=>toast.error(error.message));
                                   return;
                              }
                              form.append("image", profile.image);

                              const response = postRequests({
                                   url:"profile/?bio="+profile.bio,
                                   headers:{
                                        "Accept": "application/json",
                                        "Authorization": `Bearer ${token}`,
                                        // "Content-Type": "multipart/form-data",
                                   },
                                   data:form,
                                   stringify:false,
                              })
                              toast.success("Profile Created Successfully");
                         }}

                    >
                         <Label>
                              Upload Your Image
                         </Label>
                         <Input 
                              type="file" 
                              className="bg-mainColor"
                              onChange={(e)=>{
                                   if (e.target.files && e.target.files.length > 0) {
                                        setProfile({...profile, image:e.target.files[0]});
                                   }
                              }}
                              >
                         </Input>
                         <Label className="">
                              Enter Your job description
                         </Label>
                         <Textarea className="bg-mainColor" 
                              onChange={(e)=>{
                                   setProfile({...profile, bio:e.target.value});
                              }}
                         />
                         <Button className="bg-mainColor" type="submit">
                              Create Profile
                         </Button>
                    </form>
               </div>
          )
      }
    </div>
  );
}
