"use client";

import { useAppContext } from "@/context";
import {
  deleteRequests,
  getRequests,
  putRequests,
} from "@/server/base/base_requests";
import { useQuery } from "@tanstack/react-query";
import { AdminSite } from "@/types/states/admin";
import { remove_user, setState } from "@/app/redux/features/admin-site";
import { useDispatch } from "react-redux";
import config from "@/settings/configer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Delete,
  DeleteIcon,
  EllipsisVerticalIcon,
  PlusCircle,
  ShieldMinus,
  ShieldMinusIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import UserManager from "@/components/dashboard/admin/tools/users-manager";

export default function Page() {
  const { user, token } = useAppContext();
  const dispatch = useDispatch();
  const { data, isLoading, error } = useQuery({
    queryKey: ["employee"],
    queryFn: async () => {
      const response = await getRequests({
        url: "admin/site_data",
        token: token as string,
      });
      dispatch(setState(response as AdminSite));
      return response as AdminSite;
    },
  });
  if (!user?.is_superuser) {
    return <h1>Not authorized</h1>;
  }
  return (
    <div className="flex flex-col   my-8 w-full">
      <div className="flex flex-row w-full justify-end items-center gap-4 my-4">
        <Popover>
          <PopoverTrigger className="outline-none border-none w-fit">
            <PlusCircle size={28} className=" text-green-500" />
          </PopoverTrigger>
          <PopoverContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <UserManager />
          </PopoverContent>
        </Popover>
      </div>
      <div className="grid grid-cols-6 dark:text-white font-bold border-b-2 dark:border-gray-300">
        <h1>Image</h1>
        <h1>Name</h1>
        <h1>Email</h1>
        <h1>Role</h1>
        <h1>Team</h1>
        <h1></h1>
      </div>

      {data?.users.map((user) => {
        return (
          <div className="grid grid-cols-6 py-4 px-1 dark:text-white font-bold border-b-2 dark:border-gray-300">
            <div className="flex flex-row justify-start items-center">
              {user.image ? (
                <img
                  src={config().API_URL + user.image}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              )}
            </div>
            <div>{user.name}</div>
            <div>{user.email}</div>
            <div>{user.roll}</div>
            <div>{user.team_name}</div>
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none border-none w-fit">
                <EllipsisVerticalIcon className="w-6 h-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <button
                      className="outline-none border-none w-full flex flex-row gap-2 justify-start items-center"
                      onClick={async () => {
                        toast.promise(
                          putRequests({
                            url: "user/deactivate/" + user.id,
                            token: token as string,
                          }),
                          {
                            loading: "Deactivating user",
                            success: () => {
                              dispatch(remove_user(user.id));
                              return "User deactivated";
                            },
                            error: "Failed to deactivate user",
                          }
                        );
                      }}
                    >
                      <ShieldMinusIcon className="w-6 h-6" />
                      <p>Deactivate</p>
                    </button>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <button
                      className="text-red-500 flex flex-row gap-2 justify-start items-center"
                      onClick={async () => {
                        toast.promise(
                          deleteRequests({
                            url: "user/" + user.id,
                            token: token as string,
                          }),
                          {
                            loading: "Deactivating user",
                            success: () => {
                              dispatch(remove_user(user.id));
                              return "User deactivated";
                            },
                            error: "Failed to deactivate user",
                          }
                        );
                      }}
                    >
                      <DeleteIcon className="w-6 h-6" />
                      <p>Delete</p>
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      })}
    </div>
  );
}
