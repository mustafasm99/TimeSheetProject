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
import { Search } from "lucide-react";

import { useState } from "react";
import ProfileHolder from "@/components/profile-holder/profile-holder";
import CreateTaskForm, {
  CreateTaskButton,
} from "@/components/tasks/create_tasks";

import { Provider } from "react-redux";
import { store } from "./redux/store";

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
        </Provider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { token } = useAppContext(); // Now this works because AppWrapper wraps LayoutContent
  const [search, setSearch] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
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
            <main className="w-full">
              <SidebarTrigger />
              <div className="flex flex-col flex-1 w-full px-2 ">
                <div className="flex flex-row justify-between w-full align-baseline items-center">
                  <div className="container search-holder w-full h-20 mx-5 rounded-md">
                    <div className="h-full relative">
                      {!isSearching && (
                        <Search className="h-10 w-full absolute translate-y-1/2 -translate-x-20" />
                      )}
                      <Input
                        onInput={(e) => {
                          setSearch(e.currentTarget.value);
                          setIsSearching(true);
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
