"use client";

export default function Login(){
     return (
            <div className="h-full center text-slate-300 max-w-sm mx-auto flex flex-col place-items-center justify-center my-auto">
                      <h1 className="center font-bold text-2xl">
                               Login
                      </h1>
                      <div className="mb-5 my-5">
                      <form action="" method="post" className="border border-spacing-1 p-5 rounded-lg border-blue-500 hover:p-8 transition-all">
                      
                      <div className="my-5 mx-auto">
                         <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                               Your Email
                         </label>
                         <input type="text" name="email" id="email" className ="bg-gray-300 text-gray-900 dark:text-white" />
                         </div>

                         <div className="my-5 mx-auto">
                         <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                               Your Email
                         </label>
                         <input type="password" name="password" id="password" className ="bg-gray-300 text-gray-900 dark:text-white" />
                         </div>

                         <div className="flex justify-center">
                    <button type="submit" className="center mx-auto border border-amber-100 px-3 py-2 rounded-md hover:bg-gray-900 duration-500 transition-all">
                         Login
                    </button>
                    </div>
                  
                  </form>  
                    
                  
                  </div>
          </div>
     ); 
};