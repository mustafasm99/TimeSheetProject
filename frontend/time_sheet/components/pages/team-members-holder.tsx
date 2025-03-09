import { FullUserType } from "@/types/pages";
import config from "@/settings/configer";
type TeamMembersHolderType = {
  team_members: FullUserType[];
};

export default function TeamMembersHolder({
  team_members,
}: TeamMembersHolderType) {
  return (
    <div className="flex flex-row gap-0 items-start justify-start ">
      {team_members.length < 4
        ? team_members.map((member, index) => (
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
        : team_members
            .slice(0, 3)
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
                <div className="flex flex-row items-center justify-center w-[50px] h-[50px] rounded-full bg-darkColor text-white">
                  <h1 className="text-md font-bold capitalize">
                    +{team_members.length - 3}
                  </h1>
                </div>
              </div>
            )}
    </div>
  );
}
