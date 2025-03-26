"use client";

import { getRequests, postRequests } from "@/server/base/base_requests";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/context";
import { FullUserType } from "@/types/pages";
import { Spinner } from "@heroui/spinner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  TooltipProps,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import conf from "@/settings/configer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Attendance } from "@/types/attendance";

type Report = {
  date: string[];
  count: number;
  user: FullUserType;
};

type AttendanceResponse = {
  attendance: Attendance;
  user: FullUserType;
};

export default function Page() {
  const [attendanceToken, setAttendanceToken] = useState<string>("");
  const [attendanceData, setAttendanceData] =
    useState<AttendanceResponse | null>(null);

  const { token, user } = useAppContext();
  const { data, isLoading, error } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const response = await getRequests({
        url: "admin/employee_reports",
        token: token as string,
      });
      return response as Report[];
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["check-attendance"],
    mutationFn: async () => {
      const response = await postRequests({
        url: "admin/attendance",
        token: token || "",
        data: { token: attendanceToken },
      });
      return response as AttendanceResponse;
    },
    onSuccess: (data) => {
      setAttendanceData(data);
    },
  });

  if (!user?.is_superuser) {
    return <h1>Not authorized</h1>;
  }
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  const chartConfig = {
    attendance: {
      label: "Employee",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const chartData = data?.map((report) => ({
    attendance: report.count,
    user: report.user.user.email || "Unknown",
    image: report.user.image_url,
  }));
  return (
    <div className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-col my-4 w-full">
        <h3>Check Attendance By Token</h3>
        <div className="flex flex-row w-full justify-start items-center gap-4 my-4">
          <Input
            type="text"
            placeholder="Enter The Token"
            onChange={(e) => {
              setAttendanceToken(e.currentTarget.value);
            }}
          />
          <Button
            onClick={() => {
              mutate();
            }}
          >
            Check
          </Button>
        </div>
        {attendanceData && (
          <div className="flex flex-col px-6 py-4 justify-center items-center border rounded-lg w-fit">
            <h1>Attendance Found</h1>
            <div className="flex flex-row gap-2 justify-start items-center">
              <div>
                <h1>date: {attendanceData.attendance.day}</h1>
                <h1>email: {attendanceData.user.user.email}</h1>
                <h1>name: {attendanceData.user.user.name}</h1>
              </div>
              <img
                src={conf().API_URL + attendanceData.user.image_url}
                alt=""
                className="w-[100px] h-[100px] rounded-lg object-cover"
              />
            </div>
          </div>
        )}
      </div>
      <h1>Weekly Reports</h1>
      <ChartContainer
        config={chartConfig}
        className="max-h-1/2 w-full border border-white z-10"
      >
        <BarChart data={chartData} style={{ zIndex: 10 }}>
          <ChartTooltip content={chartToolTipCustomContent} />
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="user"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} />
          <Bar
            dataKey="attendance"
            fill="#2563eb"
            radius={[4, 4, 0, 0]}
            className="max-w-[120px] z-10"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

function chartToolTipCustomContent({
  active,
  payload,
  label,
}: TooltipProps<number, string>): JSX.Element | null {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  const data = payload[0]?.payload;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h1>{label}</h1>
      <img
        src={conf().API_URL + data.image}
        alt=""
        className="w-[100px] h-[100px] rounded-lg object-cover"
      />
      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex flex-col gap-2 justify-between items-center"
        >
          <h1>{item.dataKey}</h1>
          <h1>{item.value}</h1>
        </div>
      ))}
    </div>
  );
}
