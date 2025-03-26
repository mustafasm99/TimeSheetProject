"use client";
import localFont from "next/font/local";
import "./globals.css";
import { TanstackProvider } from "@/components/providers/tanstack-provider";
import { Toaster } from "react-hot-toast";
import { AppWrapper, useAppContext } from "@/context/index";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar/app-sidebar";
import { ThemeProvider } from "@/components/them-provider/theme-provider";
import { Input } from "@/components/ui/input";
import { ExternalLink, Search } from "lucide-react";

import { useState } from "react";
import ProfileHolder from "@/components/profile-holder/profile-holder";
import CreateTaskForm, {
  CreateTaskButton,
} from "@/components/tasks/create_tasks";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { getRequests } from "@/server/base/base_requests";
import { Attendance } from "@/types/attendance";
import { TaskType } from "@/types/states/tasks";

import { useRouter } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="center h-full overflow-x-hidden dark"
      style={{ colorScheme: "dark" }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full center`}
      >
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider
              attribute={"class"}
              defaultTheme="system"
              enableSystem
              themes={["dark", "light"]}
              disableTransitionOnChange={false}
            >
              {/* AppWrapper should wrap the entire layout */}
              <AppWrapper>
                <LayoutContent>
                  <main className="mx-5 my-2">{children}</main>
                </LayoutContent>
              </AppWrapper>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { token } = useAppContext(); // Now this works because AppWrapper wraps LayoutContent
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const router = useRouter();
  async function searchTasks() {
    const response: TaskType[] = await getRequests({
      url: "task/search?task_name=" + search,
      token: token || "",
    });
    setTasks(response);
    return response;
  }
  return (
    // create the sidebar

    <>
      <TanstackProvider>
        <Toaster position="bottom-left" />
        {token == null ? (
          children
        ) : (
          <SidebarProvider>
            <AppSidebar />
            <main className="w-full overflow-x-hidden">
              <SidebarTrigger />
              <div className="flex flex-col px-2 ">
                <div className="flex flex-row justify-between w-full align-baseline items-center">
                  <div className="container search-holder w-full h-20 mx-5 rounded-md">
                    <div className="h-full relative">
                      {!isSearching && (
                        <Search className="h-10 w-fit absolute translate-y-1/2 -translate-x-20 left-1/2" />
                      )}
                      <Input
                        onInput={(e) => {
                          setSearch(e.currentTarget.value);
                          setIsSearching(true);
                          searchTasks();
                        }}
                        placeholder="Search"
                        style={{
                          width: "100%",
                          border: "none",
                          backgroundColor: "transparent",
                          height: "100%",
                          textAlign: "center",
                          fontSize: "1.5rem",
                        }}
                      />
                      <div
                        className="grid grid-cols-5 text-center w-full h-96 border border-white rounded-md bg-white overflow-y-auto"
                        onMouseLeave={() => {
                          setIsSearching(false);
                        }}
                        style={{
                          display: isSearching ? "block" : "none",
                          zIndex: 100,
                        }}
                      >
                        <div className="grid grid-cols-5 text-center text-black w-full p-2 border-b border-black">
                          <h1>Task Name</h1>
                          <h1>Create Time</h1>
                          <h1>Start Time</h1>
                          <h1>End Time</h1>
                        </div>

                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            className="grid grid-cols-5 text-center text-black justify-between items-center p-2 border-b border-black"
                          >
                            <h1>{task.title}</h1>
                            <h1>{task.create_time}</h1>
                            <h1>{task.start_time}</h1>
                            <h2>{task.end_time}</h2>
                            <button
                              onClick={() => {
                                router.push("/task/" + task.id);
                              }}
                            >
                              <ExternalLink />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="container w-4/12">
                    <ProfileHolder />
                  </div>
                </div>
                {children}
                <CreateTaskForm />
              </div>
            </main>
          </SidebarProvider>
        )}
      </TanstackProvider>
    </>
  );
}
