"use client";
import {useAppContext} from "@/context/index";
import Login from "./auth/page";
import AdminTools from "@/components/dashboard/admin/admin-tools";

export default function Home() {

  const {token , user} = useAppContext();
  if(token === null) {
    return (
      <div className="flex flex-col align-center justify-center text-center my-10">
        <h1>
          You are not logged in
        </h1>
        <Login />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-5  my-2 w-full">
        <AdminTools />
    </div>
  );
}
