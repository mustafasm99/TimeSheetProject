"use client"

import { TanstackProviderProps } from '@/types/tanstack_interface';
import {QueryClient , QueryClientProvider} from '@tanstack/react-query';
import {useState} from 'react';


export const TanstackProvider = ({children}: TanstackProviderProps) => {         
          const [queryClient] = useState(() => new QueryClient());
          return (
               <QueryClientProvider client={queryClient}>
                    {children}
               </QueryClientProvider>
          );
     }