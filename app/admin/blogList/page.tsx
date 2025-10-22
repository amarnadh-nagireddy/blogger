"use client"

import React,{useState,useEffect} from "react";
import BlogTableItem from "@/Components/AdminComponents/BlogTableItem";
import { StaticImageData } from "next/image";
import axios from "axios";
import { toast } from "react-toastify";

const Page = () => {
  
  
    type blogType={
        _id: number;
        title: string;
        description: string;
        image: StaticImageData;
        date: number;
        category: string;
        author: string;
        authorImg: StaticImageData;
    }
  
    
    const [blogs,setBlogs]=useState<blogType[]>([]);

    const fetchBlogs=async()=>{
        const response= await axios.get(`/api/blog`);
        setBlogs(response.data.blogs || []);
    }
    const deleteBlog=async (mongoId:number)=>{
        const response= await axios.delete(`/api/blog`, {
            params: { id:mongoId }
        });
        toast.success(response.data.message);
        fetchBlogs();
    }

    useEffect(()=>{
        fetchBlogs();
    },[])
    return (   
        <div className="flex-1 pt-5 px-5 sm:pt-12 sm:p1-16">
            <h1>All blogs</h1>
            <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
                <table className="w-full text-sm text-gray-500">
                    <thead className="text-sm text-gray-700 text-left uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Blog title
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map((item,index)=>{
                            return <BlogTableItem key={index} mongoId={item._id} title={item.title} date={item.date} deleteBlog={deleteBlog}/>
                        })}
                        
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default Page;