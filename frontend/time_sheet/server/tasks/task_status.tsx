import config from "@/settings/configer";

const apiUrl = config().API_URL;

interface TaskStatus{
     status:string;
     id:number;
}


export const GetTaskStatus = async (token:string)=>{
     const response = await fetch(
          apiUrl+"/task_status",
          {
               method:"GET",
               headers:{
                    accept:"application/json",
                    Authorization:`Bearer ${token}`
               }
          }
     )
     if (response.status === 200){
          const data:TaskStatus[] = await response.json();
          return data;
     }
}
