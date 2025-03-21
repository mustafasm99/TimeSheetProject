import { ProjectPageResponse } from "@/types/pages";
import TeamMembersHolder from "./team-members-holder";

export function ProjectPageHeader(data: { data: ProjectPageResponse }) {
  if (data)
    return (
      <div className="flex flex-col items-start justify-between w-full min-h-[320px] bg-mainColor rounded-lg">
        <div
          className="w-full min-h-[220px] rounded-t-lg object-cover flex flex-col items-start justify-end"
          style={{
            backgroundImage: `url(/project_bg.jpg)`,
            backgroundSize: "cover",
          }}
        >
          <div className="flex flex-row justify-between w-full">
            <h3 className="text-3xl font-bold text-white px-5">
              {data.data.projects.project.name}
            </h3>

            <h3 className="text-3xl font-bold text-white px-5">
              team : {data.data.projects.team.name}
            </h3>
          </div>
        </div>

        <div className="flex flex-row justify-between w-full">
          <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-2 items-center justify-center mx-5 my-2">
              <h1 className="text-md font-bold capitalize text-fontColor">
                start date
              </h1>
              <h1 className="text-md  bg-widgetsColor text-white px-4 py-2 rounded-sm">
                {new Date(
                  data.data.projects.project.start_time
                ).toLocaleDateString()}
              </h1>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center mx-5 my-2">
              <h1 className="text-md font-bold capitalize text-fontColor">
                due date
              </h1>
              <h1 className="text-md  bg-widgetsColor text-white px-4 py-2 rounded-sm">
                {new Date(
                  data.data.projects.project.end_time
                ).toLocaleDateString()}
              </h1>
            </div>
          </div>

          <div className="flex flex-row gap-4 items-center justify-start mx-5 my-2 border-l-2 border-white pl-4">
            <div className="flex justify-center items-center rounded-full border-2 border-white w-[50px] h-[50px]">
              <h1 className="text-md font-bold capitalize text-fontColor">
                {data.data.projects.team_members.length}
              </h1>
            </div>
            <p>members :</p>
            <TeamMembersHolder 
            key={data.data.projects.project.id}
            team_members={data.data.projects.team_members} />
          </div>
        </div>
      </div>
    );
}
