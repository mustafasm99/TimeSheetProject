import config from "@/settings/configer";
import { profileMe } from "@/types/profile_type";

const apiUrl = config().API_URL;





export const GetMyProfile = async (token: string) => {
  const response = await fetch(apiUrl + "/profile/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
     if (response.status === 201 || response.status === 200) {
     const data: profileMe = await response.json();
     data.profile_image = `${apiUrl}/profile/me/image?id=${data.id}`;
     return data;
     } 
     else 
     {
     return null;
     }
};
