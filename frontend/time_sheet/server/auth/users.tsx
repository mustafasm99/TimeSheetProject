export const getUsers = async (
     username:string,
     password:string,
)=>{
     const response = await fetch('/api/auth/users',{
          method:'POST',
          headers:{
               'Content-Type':'application/json'
          },
          body:JSON.stringify({username,password})
     });
     if(response.ok){
          return response.json();
     }else{
          throw new Error('Failed to fetch data');
     }
}