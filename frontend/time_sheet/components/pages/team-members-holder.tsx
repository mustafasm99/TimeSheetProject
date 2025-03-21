import { FullUserType } from "@/types/pages";
import config from "@/settings/configer";
type TeamMembersHolderType = {
  team_members: FullUserType[];
  showMembers?: number;
};

export default function TeamMembersHolder({
  team_members,
  showMembers = 4,
}: TeamMembersHolderType) {
  return (
    <div className="flex flex-row gap-0 items-start justify-start ">
      {team_members.length < showMembers
        ? team_members.map((member, index) => (
            <div
              key={index}
              className="flex flex-col gap-1 items-center justify-center"
            >
              <img
                src={config().API_URL + member.image_url}
                alt="user"
                className={` ${
                  index !== 0 ? "-left-5 z-20" : "z-10"
                } relative border-[6px] border-darkColor w-[50px] h-[50px] rounded-full object-cover`}
              />
            </div>
          ))
        : team_members
            .slice(0, showMembers)
            .map((member, index) => (
              <div
                key={member.user.id}
                className="flex flex-col gap-1 items-center justify-center"
              >
                <img
                  src={config().API_URL + member.image_url}
                  alt="user"
                  className={` ${
                    index !== 0 ? "-left-5 z-20" : "z-10"
                  } relative border-[6px] border-darkColor w-[50px] h-[50px] rounded-full object-cover`}
                />
              </div>
            ))
            .concat(
              <div className="flex flex-col gap-1 items-center justify-center">
                <div className="flex relative -left-10 z-20 flex-row items-center border-[6px] justify-center w-[50px] h-[50px] rounded-full bg-widgetsColor text-white">
                  <h1 className="">+{team_members.length - showMembers}</h1>
                </div>
              </div>
            )}
    </div>
  );
}
