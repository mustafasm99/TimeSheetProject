
const base_url = "http://localhost:8000/";

type getRequestsType = {
     token?:string;
     url:string;
     queryKey?:string;
     isBlob?:boolean;
}

type postRequestsType = {
     token?:string;
     url:string;
     queryKey?:string;
     data:object;
     headers?:{};
     stringify?:boolean;
}

type deleteRequestsType = {
     token?:string;
     url:string;
}

type putRequestsType = {
     url:string;
     token?:string;
     queryKey?:string;
     data?:object;
}

export function getRequests(
{
     token,
     url,
     queryKey = "",
     isBlob = false
}:getRequestsType
){
     const response = fetch(base_url + url + queryKey, {
          method: "GET",
          headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
          }
     });
     
     const data = response.then((res) => {
          return isBlob ? res.blob() : res.json();
     });

     return data;
};

export function getRequestsProms(
     {
          token,
          url,
          queryKey = "",
          isBlob = false
     }:getRequestsType
     ){
          const response = fetch(base_url + url + queryKey, {
               method: "GET",
               headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
               }
          });
          response.then((res) => {
               if(res.ok){
                    return res;
               }
               throw new Error(res.statusText);
          });
     };


export async function postRequests(
{
     token,
     url,
     queryKey = "",
     headers = {},
     data,
     stringify = true
}:postRequestsType
){
     const response = fetch(base_url + url + queryKey, {
          method: "POST",
          headers: Object.keys(headers).length === 0 ?{
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
          }:headers,
          body: stringify ? JSON.stringify(data) : (data instanceof FormData ? data : JSON.stringify(data)),
     });
     const res = response.then((res) => res.json());

     return res;
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

export async function putRequests(
{
     token,
     url,
     queryKey = "",
     data
}:putRequestsType
){
     const response = fetch(base_url + url + queryKey, {
          method: "PUT",
          headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(data),
     });
     const res = response.then((res) => res.json());
}