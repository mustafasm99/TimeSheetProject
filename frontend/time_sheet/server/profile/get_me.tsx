import config from "@/settings/configer";

const apiUrl = config().API_URL;

interface profileMe {
  id:number;   
  bio: string;
  profile_image: string | undefined;
}

export const GetMyProfile = async (token: string) => {
  const response = await fetch(apiUrl + "/profile/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
     if (response.ok) {
     const data: profileMe = await response.json();
     data.profile_image = `${apiUrl}/profile/me/image?id=${data.id}`;
     return data;
     } else {
     throw new Error("Failed to fetch data");
     }
};
