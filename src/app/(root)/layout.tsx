'use client'
import {Sidebar} from "@/components/sidebar"
import { Toaster } from "react-hot-toast";
import { usePathname } from 'next/navigation';
// import { useRouter } from 'next/router';


export const maxDuration = 60;
export const fetchCache = 'force-no-store';

export default function HomeLayout({children} : {children: React.ReactNode}){
    // const pathname = usePathname();
    
    return(
        <main className="mx-3 mt-16 sm:ml-[250px] sm:mt-0">
            <Toaster />
            <Sidebar />
                {children}
        </main>
    );
}