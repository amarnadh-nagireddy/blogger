import React from "react";
import { useRouter } from "next/navigation";
 type blogTableType={
        mongoId: number;
        title: string;
        date: number;
        deleteBlog: (mongoId:number)=>Promise<void>;
    }
  
const BlogTableItem = ({title,date,mongoId,deleteBlog} :blogTableType) => {
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