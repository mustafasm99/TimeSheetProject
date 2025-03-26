import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
} from "@/components/ui/sidebar";
import { ThemeButton } from "../theme-buttom/theme-buttom";
import {
  Home,
  TableOfContents,
  Group,
  Menu,
  CalendarDays,
  Settings,
  ClockAlert,
  LogOut,
  UsersRoundIcon,
  ChartAreaIcon,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";

export default function AppSidebar() {
  const { state } = useSidebar();
  const router = useRouter();
  const { token, user } = useAppContext();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {state == "collapsed" ? (
          <div className="flex flex-col justify-between align-baseline text-center items-center">
            <ClockAlert className="text-xl my-3" />
            <ThemeButton />
          </div>
        ) : (
          <div className="flex justify-between align-baseline text-center items-center">
            <h1 className="text-xl font-bold mx-3">Time Sheet</h1>
            <ThemeButton />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        {state == "collapsed" ? (
          <SidebarGroup>
            <a
              href="/"
              className={`block py-8 ${
                window.location.pathname === "/"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <Home />
              </div>
            </a>
            {user?.is_superuser && (
              <>
                <a
                  href="/employee"
                  className={`block py-8 ${
                    window.location.pathname === "/employee"
                      ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-start">
                    <UsersRoundIcon />
                  </div>
                </a>
                <a
                  href="/reports"
                  className={`block py-8 ${
                    window.location.pathname === "/reports"
                      ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-start">
                    <ChartAreaIcon />
                  </div>
                </a>
              </>
            )}
            <a
              href="/time_sheet"
              className={`block py-8 ${
                window.location.pathname === "/time_sheet"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <TableOfContents />
              </div>
            </a>
            <a
              href="/time_sheet/submit"
              className={`block py-8 ${
                window.location.pathname === "/time_sheet/submit"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <Group />
              </div>
            </a>
            <a
              href=""
              className={`block py-8 ${
                window.location.pathname === ""
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <Menu />
              </div>
            </a>
            <a
              href="/time_sheet/submit"
              className={`block py-8 ${
                window.location.pathname === "/time_sheet/submit"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <CalendarDays />
              </div>
            </a>

            <a
              href="/time_sheet/submit"
              className={`block py-8 ${
                window.location.pathname === "/time_sheet/submit"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <Settings />
              </div>
            </a>
          </SidebarGroup>
        ) : (
          <SidebarGroup title="Dashboard">
            <a
              href="/"
              className={`block py-8 px-4 ${
                window.location.pathname === "/"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <Home className="mx-2" />
                <span>Home</span>
              </div>
            </a>
            {user?.is_superuser && (
              <>
                <a
                  href="/employee"
                  className={`block py-8 px-4 ${
                    window.location.pathname === "/employee"
                      ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-start">
                    <UsersRoundIcon className="mx-2" />
                    <span>Employee</span>
                  </div>
                </a>
                <a
                  href="/reports"
                  className={`block py-8 px-4 ${
                    window.location.pathname === "/reports"
                      ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                      : ""
                  }`}
                >
                  <div className="flex justify-start">
                    <ChartAreaIcon className="mx-2" />
                    <span>Reports</span>
                  </div>
                </a>
              </>
            )}
            <a
              href="/projects"
              className={`block py-8 px-4 ${
                window.location.pathname === "/projects"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <Group className="mx-2" />
                <span>PROJECTS</span>
              </div>
            </a>
            <a
              href="/my-task"
              className={`block py-8 px-4 ${
                window.location.pathname === "/my-task"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <Menu className="mx-2" />
                <span>MY TASK</span>
              </div>
            </a>
            <a
              href="/calendar"
              className={`block py-8 px-4 ${
                window.location.pathname === "/calendar"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <CalendarDays className="mx-2" />
                <span>CALENDAR</span>
              </div>
            </a>

            <a
              href="/attendance"
              className={`block py-8 px-4 ${
                window.location.pathname === "/attendance"
                  ? "bg-red-500 bg-gradient-to-l from-red-900 rounded-xl to-transparent bg-opacity-10 text-red-500"
                  : ""
              }`}
            >
              <div className="flex justify-start">
                <Settings className="mx-2" />
                <span>My Attendance </span>
              </div>
            </a>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <button
          className={`w-full py-4 bg-red-500 text-white items-center justify-center flex rounded-lg${
            state == "collapsed" ? "h-fit rounded-lg" : " "
          }`}
          onClick={() => {
            localStorage.clear();
            window.location.reload();
            router.refresh();
          }}
        >
          {state == "collapsed" ? <LogOut /> : "Logout"}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
