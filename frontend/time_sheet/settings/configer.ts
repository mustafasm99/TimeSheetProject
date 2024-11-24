import dotenv from 'dotenv';
dotenv.config();
const config = () => {
    const apiUrl = process.env.API_URL;
//  TODO: create fix dotenv file make it work   console.log('Config API URL:', apiUrl);
    return {
        API_URL: "http://127.0.0.1:8000"
    };
};

export default config;