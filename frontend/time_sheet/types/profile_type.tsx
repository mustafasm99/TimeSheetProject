export interface userData {
     name:string;
     email:string;
     is_superuser:boolean;
     is_active:boolean;
}

export interface profileMe {
     id:number;   
     bio: string;
     profile_image: string | undefined;
     user:userData;
}