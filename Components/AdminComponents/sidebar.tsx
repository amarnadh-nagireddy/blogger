import React from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import Link from "next/link";
import Logout from "@/Components/AdminComponents/Logout";
export default function Sidebar() {
    return (
        <div className="w-28 sm:w-80 h-[100vh] flex flex-col justify-between border border-black bg-slate-100">
    {/* Top Section */}
    <div className="py-12 px-3">
        <Link href="/admin/addProduct" className="flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000]">
            <Image src={assets.add_icon} alt="dashboard" width={28}/>
            <p>Add Blog</p>
        </Link>
        <Link href="/admin/blogList" className="mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000]">
            <Image src={assets.blog_icon} alt="dashboard" width={28}/>
            <p>Blog lists</p>
        </Link>
    </div>

    {/* Bottom Section (Logout) */}
    <div className="py-5 ml-7 px-3">
        <Logout />
    </div>
</div>

    )
}