"use client";

import { useAppContext } from "@/context";
import { useParams, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRequests } from "@/server/base/base_requests";
import { CircleCheckBig, ShieldAlert } from "lucide-react";

export default function Page() {
  const { token } = useAppContext();

  const { token: QrToken } = useParams();
  const pathname = usePathname();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["attendance", token],
    queryFn: async () => {
      const response = await getRequests({
        url: "attendance/read-token/" + QrToken,
        token: token || "",
      });
      return response;
    },
  });

  return data ? (
    <div className="w-full h-screen flex flex-col gap-4 justify-center items-center">
      <CircleCheckBig size={100} color="green" />
      <h1 className="text-2xl font-bold text-green-500">
        Attendance Marked Successfully
      </h1>
    </div>
  ) : (
    <div className="w-full h-screen flex flex-col gap-4 justify-center items-center">
      <ShieldAlert size={100} color="red" />
      <h1 className="text-2xl font-bold text-red-500">
        Attendance Marked Failed
      </h1>
    </div>
  );
}
