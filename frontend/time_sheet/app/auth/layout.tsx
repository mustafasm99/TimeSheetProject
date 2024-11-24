import { AuthProps } from "@/types/layout_interface";
import { ReactNode } from "react"


export default function Auth({ children }: AuthProps) {
    return (
        <div className="container m-5 p-3 h-full w-full">
          <div className="flex justify-between h-full w-full">
                 <div className="hidden md:flex flex-1 border box-border rounded-md overflow-hidden p-1">
                    <img className="rounded-md overflow-hidden object-cover" src="/bg.svg" alt="loading .." />
                 </div>
               <div className="flex flex-1 justify-center mx-auto w-max">
                    {children}
               </div>
          </div>
        </div>
    );
}