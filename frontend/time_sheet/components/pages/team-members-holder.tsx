import { FullUserType } from "@/types/pages";
import config from "@/settings/configer";
type TeamMembersHolderType = {
     team_members: FullUserType[];
}

export default function TeamMembersHolder(
     { team_members }: TeamMembersHolderType
) {
     return (
          <div className="flex flex-row gap-0 items-start justify-start">
               {
                    team_members.map((member , index) => (
                         <div key={member.user.id} className="flex flex-col gap-1 items-center justify-center">
                              <img src={config().API_URL+member.image_url} alt="user" className={
                                   ` ${index !== 0 ? "-left-5 z-20" : "z-10"} relative border-[6px] border-darkColor w-[50px] h-[50px] rounded-full object-cover`
                              }/>
                         </div>
                    ))
               }
          </div>
     )
}