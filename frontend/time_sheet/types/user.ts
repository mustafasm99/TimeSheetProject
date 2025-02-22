export type UserType = {
     id:number;
     name:string;
     email:string;
     is_superuser:boolean;
     is_active:boolean;
     roll?:string;
     team_name?:string;
     image?:string;
     is_temp_password?:boolean;
     have_profile?:boolean;
}