"use client"

import { StaticImageData } from "next/image";
import React, { useEffect, useState, use  } from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import axios from "axios";
import DOMPurify from "dompurify";
type blogType={
        id: number;
        title: string;
        description: string;
        image: StaticImageData;
        date: number;
        category: string;
        author: string;
        authorImg: StaticImageData;
    }
const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  
    
    const [data,setData]=useState<blogType | null>(null);
    
    const fetchBlogData=async()=>{
        const response= await axios.get(`/api/blog`, {
            params: { id }
        });
        setData(response.data);
        console.log(response);
    }

    useEffect(()=>{
        fetchBlogData();
    },[])
    
    return (
       data? <>
        <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
            <div className="flex justify-between items-center">
                <Image src={assets.logo} width={180} alt='' className="w-[130px] sm:w-auto" />
            
            </div>
            <div className="text-center my-24">
                <h1 className="text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto">{data.title}</h1>
            </div>
        
        </div>
        <div className="mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10">
            <Image src={data.image} alt="" width={1280} height={720} className="border-4 border-white"/>
            
            <div
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(data.description),
                }}
            ></div>

        </div>
        </>:<></>
    );
}

export default Page;