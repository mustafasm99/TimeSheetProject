"use client";

import { getRequests } from "@/server/base/base_requests";
import { useQuery , useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/context";
import { Spinner } from "@heroui/spinner";
import { Attendance } from "@/types/attendance";
import { useState } from "react";
import { set } from "date-fns";
import { CircleCheck } from "lucide-react";



export default function Page() {
  const { token } = useAppContext();
  const [qrURL, setQrURL] = useState<string | null>(null);
  const [ showQR , setShowQR] = useState<boolean>(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const res = await getRequests({
        url: "attendance/today",
        token: token || "",
      });
      console.log(res , "res for attendance");
      return res as Attendance | null;
    },
    // refetchInterval: 30000 // Refetch every 30 seconds
  });

  
  const { mutate } = useMutation({


     mutationKey: ["attendance"],
     mutationFn: async () => {
       const res = await getRequests({
         url: "attendance/token",
         token: token || "",
         isBlob: true,
        });
      return URL.createObjectURL(res);
     },
     onSuccess: (data) => {
       setQrURL(data as string);
       setShowQR(true);
     },
  })

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center">
      {isLoading && <Spinner size="lg" />}
      {
     ( data == null && !showQR) ? 
          <div className="flex flex-col">
               <p>
                    no attendance for today log in to system
               </p>
               <button onClick={()=>{mutate()}} className="bg-blue-500 text-white p-2 rounded-lg">
                    Attendance In
               </button>
          </div>
          :
          (qrURL && showQR) &&
          <div className="flex flex-col">
              <img src={qrURL} alt="" />
          </div>
      }
      {
        data && !showQR &&
        <div className="flex flex-col gap-4 justify-center items-center">
          <CircleCheck size={100} color="green" />
          <h1 className="text-2xl font-bold text-green-500">
          
            Your attendance is already marked for today
          </h1>
        </div>
      }
    </div>
  );
}
