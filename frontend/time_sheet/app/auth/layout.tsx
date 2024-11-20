import { AuthProps } from "@/types/layout_interface";
import { ReactNode } from "react"


export default function Auth({ children }: AuthProps) {
    return (
        <div className="container m-5 p-3 h-full">
          <div className="flex justify-between h-full">
                 <div className="hidden md:flex flex-1 border box-border rounded-md overflow-hidden p-1">
                    <img className="rounded-md overflow-hidden object-cover" src="/bg.svg" alt="loading .." />
                 </div>
               <div className="flex-1">
                    {children}
               </div>
          </div>
        </div>
    );
}