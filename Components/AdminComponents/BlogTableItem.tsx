import React from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import { useRouter } from "next/navigation";
const BlogTableItem = ({authorImg,title,author,date,mongoId,deleteBlog} :any) => {
    const BlogDate=new Date(date);
    const router = useRouter();
    return (   
        <tr className="bg-white border-b">
        
        <td className="px-6 py-4">
            {title?title:"Blog title"}
        </td>
        <td className="px-6 py-4">
            {BlogDate.toDateString()}
        </td>
        <td className="px-3 py-4" >
            <button className="font-medium text-blue-600 hover:underline" onClick={() => router.push(`/admin/updateProduct/${mongoId}`)} > Update</button>
            &nbsp; | &nbsp;
            <button className="font-medium text-red-600 hover:underline" onClick={()=>deleteBlog(mongoId)}>Delete</button>
        </td>
        </tr>
    )
}
export default BlogTableItem;