"use client";

import { loginUser } from "@/server/auth/users";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/index";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const { mutate, isError, isSuccess } = useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      toast.error("Failed to login");
      console.log(error);
    },
    onSuccess: (data) => {
      toast.success("Successfully logged in");
      window.location.reload()
      router.push("/");
    },
  });

  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");

  const { token } = useAppContext();
  return (
    <div className="h-[100vh] w-full  text-slate-300 flex flex-row  justify-between items-center">
        <div className="hidden md:flex border box-border rounded-md overflow-hidden p-1 w-full h-full">
          <img
            className="rounded-md overflow-hidden object-cover"
            src="/bg.svg"
            alt="loading .."
          />
        </div>
      <div className="mb-5 my-5 flex flex-col justify-center items-center h-full w-full">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await mutate({ username: username, password: password });
            //  window.location.href = "/";
          }}
          action=""
          method="post"
          className="border border-spacing-1 p-5 rounded-lg border-blue-500 hover:p-8 transition-all min-w-[300px] w-1/2 min-h-[300px] h-auto"
        >
          <div className="flex flex-col justify-center items-center">
            <Users size={70} className="bg-mainColor p-1 rounded-full border-4 border-white"/>
            <h1 className="center font-bold text-2xl">Login</h1>
          </div>
          <div className="my-5 w-full">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Email
            </label>
            <Input
              type="text"
              name="email"
              id="email"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="bg-mainColor w-full"
              placeholder="Your Email"
            />
          </div>

          <div className="my-5 mx-auto">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              placeholder="Password"
            />
          </div>

          <div className="flex flex-row justify-center items-center w-full">
            <Button
              type="submit"
              className="w-full px-8 my-6"
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
