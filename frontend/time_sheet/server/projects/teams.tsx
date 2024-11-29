import config from "@/settings/configer";
import {ProjectType} from "@/types/projects";

const apiUrl = config().API_URL;

interface member {
     id:number;
     name:string;
     bio:string;
     profile_image:string;
}

interface myTeam {
     team_id:number;
     name:string;
     description:string;
     team_lead_id:number;
     members:member[];
     projects:ProjectType[];
}

export const GetMyTeams = async (token:string) => {
     const response = await fetch(apiUrl+"/team/my_teams",{
          method:"GET",
          headers : {
               accept:"application/json",
               Authorization:`Bearer ${token}`
          }
     });
     if(response.status === 201 || response.status === 200){
          const data:myTeam = await response.json();
          return data;
     }
     else{
          return null;
     }
}