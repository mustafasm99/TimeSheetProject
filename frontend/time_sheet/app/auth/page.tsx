"use client";

import { loginUser } from "@/server/auth/users";
import { useQuery, useMutation } from "@tanstack/react-query";
import { NextResponse } from "next/server";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/index";

export default function Login() {
  const { mutate, isError, isSuccess } = useMutation({
    mutationFn: loginUser,
    onError: (error) => {
      toast.error("Failed to login");
      console.log(error);
    },
    onSuccess: (data) => {
      toast.success("Successfully logged in");
      
    },
  });

  var [username, setUsername] = useState("");
  var [password, setPassword] = useState("");

  const {token} = useAppContext();
  return (
    <div className="h-full center text-slate-300 max-w-sm mx-auto flex flex-col place-items-center justify-center my-auto">
      <h1 className="center font-bold text-2xl">Login</h1>
      <div className="mb-5 my-5">
        <form
          onSubmit={async (e) => {
               e.preventDefault();
               await mutate({ username: username, password: password });
               window.location.href = "/";
          }}
          action=""
          method="post"
          className="border border-spacing-1 p-5 rounded-lg border-blue-500 hover:p-8 transition-all"
        >
          <div className="my-5 mx-auto">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              onChange={ (e) => {
                setUsername(e.target.value);
              }}
              className="bg-gray-300 text-gray-900 "
            />
          </div>

          <div className="my-5 mx-auto">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Your Email
            </label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="bg-gray-300 text-gray-900"
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="center mx-auto border border-amber-100 px-3 py-2 rounded-md hover:bg-gray-900 duration-500 transition-all"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
