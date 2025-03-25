"use client";

import { getRequests } from "@/server/base/base_requests";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/context";
import { Spinner } from "@heroui/spinner";
import { Attendance } from "@/types/attendance";
import { useState } from "react";
import { set } from "date-fns";
import { CircleCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import toast from "react-hot-toast";

export default function Page() {
  const { token } = useAppContext();
  const [qrURL, setQrURL] = useState<string | null>(null);
  const [showQR, setShowQR] = useState<boolean>(false);
  const { data, isLoading, error } = useQuery({
    queryKey: ["attendance"],
    queryFn: async () => {
      const res = await getRequests({
        url: "attendance/today",
        token: token || "",
      });
      console.log(res, "res for attendance");
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
  });

  const { data: myAttendanceData, isLoading: myAttendanceLoading } = useQuery({
    queryKey: ["my-attendance"],
    queryFn: async () => {
      const res: Attendance[] = await getRequests({
        url: "attendance/me",
        token: token || "",
      });
      return res;
    },
  });
  console.log(myAttendanceData, "my attendance data");
  return (
    <div className="flex flex-row w-full h-screen justify-center items-center rounded-lg p-4 gap-4 flex-wrap md:flex-nowrap">
      <div className="flex flex-col justify-center items-center w-1/2 h-1/2 border border-white rounded-lg">
        {myAttendanceLoading && <Spinner size="lg" />}
        {myAttendanceData && (
          <div className="w-full h-full">
            <div className="grid grid-cols-3  bg-gray-200 p-2 text-black text-center">
              <p className="font-bold">Date</p>
              <p className="font-bold">Time In</p>
              <p className="font-bold">Time Out</p>
            </div>

            {myAttendanceData.map((attendance) => (
              <div className="grid grid-cols-3 text-center" key={attendance.id}>
                <p className="border px-4 py-2">
                  {new Date(attendance.day).toDateString()}
                </p>
                <p className="border px-4 py-2">
                  {new Date(attendance.time).toLocaleTimeString()}
                </p>
                <p className="border px-4 py-2 text-center max-w-xs truncate cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(attendance.token);
                    toast.success("Token copied to clipboard");
                  }}
                >
                  {attendance.token ? token : "Not Marked"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-col w-1/2 h-1/2 border border-white rounded-lg justify-center items-center">
        {isLoading && <Spinner size="lg" />}
        {data == null && !showQR ? (
          <div className="flex flex-col">
            <p>no attendance for today log in to system</p>
            <button
              onClick={() => {
                mutate();
              }}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              Attendance In
            </button>
          </div>
        ) : (
          qrURL &&
          showQR && (
            <div className="flex flex-col">
              <img src={qrURL} alt="" />
            </div>
          )
        )}
        {data && !showQR && (
          <div className="flex flex-col gap-4 justify-center items-center">
            <CircleCheck size={100} color="green" />
            <h1 className="text-2xl font-bold text-green-500">
              Your attendance is already marked for today
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
