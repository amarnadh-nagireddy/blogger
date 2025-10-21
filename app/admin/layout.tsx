"use client"
import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/sidebar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from 'react-toastify';
export default function Layout({children}: {children:React.ReactNode}){
    const router = useRouter();
    return (
        <>
        <div className="flex">
            <ToastContainer theme="dark" />
            <Sidebar/>
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
                    <h3 className="font-medium">Admin Panel</h3>
                    <button onClick={() => router.push('/') }className="flex items-center gap-1 font-medium py-1 px-2 sm:py-3 sm:px-4 border border-solid border-black">Home Page<Image src={assets.arrow} alt="arrow"/></button>
                </div>
                {children}
            </div>
        </div>
        
        </>
    )
}