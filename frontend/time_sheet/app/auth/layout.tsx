import { AuthProps } from "@/types/layout_interface";
import { ReactNode } from "react"


export default function Auth({ children }: AuthProps) {
    return (
        <div className="h-full w-full">
            {children}          
        </div>
    );
}