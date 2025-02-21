
import ProjectsTools from "./projects";
import TeamsManagement from "./teams";
import { useQuery } from "@tanstack/react-query";
import { useDispatch , useSelector } from "react-redux";
import { setState } from "@/app/redux/features/admin-site";
import { getRequests } from "@/server/base/base_requests";
import { useAppContext } from "@/context";
import { AdminSite } from "@/types/states/admin";
import UserManager from "./tools/users-manager";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";

export default function AdminTools() {
  const {token} = useAppContext()
  const dispatch = useDispatch();
  const { data , isLoading } = useQuery({
    queryKey:["admin-site"],
    queryFn: async () => {
      const response = await getRequests({
        url: "admin/site_data",
        token: token as string,
      })
      dispatch(setState(response as AdminSite))
      return response as AdminSite;
    }
  });
  if(isLoading){
    return <div>Loading...</div>
  }
  return (
    <Box className="w-full">
      <Masonry
        className="px-0 py-1"
        columns = {3}
        spacing={4}
        defaultHeight={250}
        defaultColumns={3}
        sequential
      >
        <TeamsManagement />
        <ProjectsTools />
        <UserManager />
      </Masonry>
    </Box>
  );
}
