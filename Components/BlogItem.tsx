import React from "react";
import Image from "next/image";
import Link from "next/link";
import {assets} from '@/Assets/assets'
type blogItemType={
    title: string;
    category: string;
    image: string;
    id: string;
}
const BlogItem=({title,category,image,id}:blogItemType) => {
    return (
        <div className="max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000]"> 
        <Link href={`/blogs/${id}`}>  
            <Image 
                src={`${image}?w=400&h=400&c_fill&q_auto,f_auto`} 
                alt={title} 
                width={400} 
                height={400} 
                placeholder="blur"
                blurDataURL="/placeholder.png"
                className="border-b border-black"
                />

        </Link>
            <p className="ml-5 mt-5 px-1 inline-block bg-black text-white text-sm ">{category}</p>
            <div className="p-5">
                <h5 className="mb-2 text-lg font-medium tracking-tight text-gray-900">{title}</h5>
                
                <Link href={`/blogs/${id}`} className="inline-flex items-center py-2 font-semibold text-center">
                    Read more<Image src={assets.arrow} alt="arrow" className="ml-2" width={12}/>
                </Link>
            </div>
        
        </div>
    );
}

export default BlogItem;