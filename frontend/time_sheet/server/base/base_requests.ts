
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

type deleteRequestsType = {
     token?:string;
     url:string;
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

export function deleteRequests(
{
     token,
     url,
}:deleteRequestsType
){
     const response = fetch(base_url + url, {
          method: "DELETE",
          headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
          }
     });
     const data = response.then((res) => {
          if(res.status === 204){
               return "Deleted successfully";
          }
          return res.json();
     });

     return data;
}