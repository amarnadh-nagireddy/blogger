import React , {useState} from "react"
import Image from "next/image"
import {assets} from '@/Assets/assets'
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Header = () => {
    const router = useRouter();

    return (
        <div className="py-5 px-5 md:px-12 lg:px-28">
            <div className="flex justify-between items-center">
                <Image src={assets.logo} alt="logo" width={180} height={50} className="w-[130px] sm:w-auto"/>
                <button onClick={() => router.push('/admin') }className="flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]">Admin Panel<Image src={assets.arrow} alt="arrow"/></button>
            </div> 
            
            <div className="text-center my-8">
                <h1 className="text-3xl mb-3 sm:text-5xl font-medium">Fresh Reads</h1>
                <hr />
            </div>
            
        </div>
    );
};

export default Header;