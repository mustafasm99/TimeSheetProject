import config from '@/settings/configer';

console.log('Loaded API URL:', config().API_URL); // Add this line to verify the loaded API URL

interface userLoginForm {
     username:string;
     password:string;
}



export const loginUser = async ({ username, password }: userLoginForm) => {
     
     console.log(username , password , config().API_URL);
     const response = await fetch(config().API_URL + '/auth/login', {
          method: 'POST',
          headers: {
               'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({ username, password }).toString() // way to send from data 
     });
     if (response.ok) {
          const data = await response.json();
          document.cookie = `token=${data.access_token}; path=/; HttpOnly`;
          localStorage.setItem('token', data.access_token);
          return data;
          
     } else {
          throw new Error('Failed to fetch data');
     }
}