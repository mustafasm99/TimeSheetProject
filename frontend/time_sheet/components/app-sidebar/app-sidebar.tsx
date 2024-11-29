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
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { stat } from "fs";

export default function AppSidebar() {
  const { state } = useSidebar();

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
               <a href="/" className="block py-8">
               <div className="flex justify-start">
                    <Home />
               </div>
               </a>
               <a href="/time_sheet" className="block py-8">
               <div className="flex justify-start">
                    <TableOfContents />
               </div>
               </a>
               <a href="/time_sheet/submit" className="block py-8">
               <div className="flex justify-start">
                    <Group />
               </div>
               </a>
               <a href="" className="block py-8">
               <div className="flex justify-start">
                    <Menu />
               </div>
               </a>
               <a href="/time_sheet/submit" className="block py-8">
               <div className="flex justify-start">
                    <CalendarDays />
               </div>
               </a>
     
               <a href="/time_sheet/submit" className="block py-8">
               <div className="flex justify-start">
                    <Settings />
               </div>
               </a>
          </SidebarGroup>
        ) : (
          <SidebarGroup title="Dashboard">
            <a href="/" className="block py-8 px-4">
              <div className="flex justify-start">
                <Home className="mx-2" />
                <span>Home</span>
              </div>
            </a>
            <a href="/time_sheet" className="block py-8 px-4">
              <div className="flex justify-start">
                <TableOfContents className="mx-2" />
                <span>Time Sheet</span>
              </div>
            </a>
            <a href="/time_sheet/submit" className="block py-8 px-4">
              <div className="flex justify-start">
                <Group className="mx-2" />
                <span>PROJECTS</span>
              </div>
            </a>
            <a href="" className="block py-8 px-4">
              <div className="flex justify-start">
                <Menu className="mx-2" />
                <span>MY TASK</span>
              </div>
            </a>
            <a href="/time_sheet/submit" className="block py-8 px-4">
              <div className="flex justify-start">
                <CalendarDays className="mx-2" />
                <span>CALENDAR</span>
              </div>
            </a>

            <a href="/time_sheet/submit" className="block py-8 px-4">
              <div className="flex justify-start">
                <Settings className="mx-2" />
                <span>SETTINGS</span>
              </div>
            </a>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
          {
               state == "collapsed" ?
                (
                    <a href="/logout" className="block mx-auto">
                         <LogOut />
                    </a>
                )
                 :
                (
                <a href="/" className="block py-2 px-4" onClick={()=>{
                  localStorage.removeItem("token");
                }}>
                    Logout
                </a>
               )
          }
        
      </SidebarFooter>
    </Sidebar>
  );
}
