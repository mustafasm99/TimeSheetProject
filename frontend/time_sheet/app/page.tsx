"use client";
import {useAppContext} from "@/context/index";
import Login from "./auth/page";

export default function Home() {

  const {token} = useAppContext();
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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>
        hello world
      </h1>
    </div>
  );
}
