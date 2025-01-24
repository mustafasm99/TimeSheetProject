
const base_url = "http://localhost:8000/";

type getRequestsType = {
     token?:string;
     url:string;
     queryKey?:string;
}

type postRequestsType = {
     token?:string;
     url:string;
     queryKey?:string;
     data:object;
}

export function getRequests(
{
     token,
     url,
     queryKey = ""
}:getRequestsType
){
     const response = fetch(base_url + url + queryKey, {
          method: "GET",
          headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
          }
     });
     const data = response.then((res) => res.json());

     return data;
};

export function postRequests(
{
     token,
     url,
     queryKey = "",
     data
}:postRequestsType
){
     const response = fetch(base_url + url + queryKey, {
          method: "POST",
          headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
     });
     const res = response.then((res) => res.json());

     return data;
}