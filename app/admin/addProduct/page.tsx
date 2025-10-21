"use client"

import React,{useState, useEffect, use} from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import Editor from "@/Components/AdminComponents/Editor";

    
const page = () => {
    const [image, setImage] = useState<File | null>(null);
    
    
     
    

    const [data,setData]=useState({
        title:"",
        description:"",
        category:"Startup",
        authorImg:"/profile_icon.png"
    });
    
    const onChangeHandler=(e:any)=>{
        const name=e.target.name;
        const value=e.target.value;
        setData(data=>({...data,[name]:value}));
        console.log(data);
    }
    

    const onSubmitHandler=async(e:any)=>{
        e.preventDefault();
       
        const formData=new FormData();
        formData.append("title",data.title);
        formData.append("description",data.description);
        formData.append("category",data.category);
        formData.append("authorImg",data.authorImg);
        

        
        if (image){
            formData.append("image",image);
        }
        const res=await axios.post("/api/blog", formData);

        if (res.data.success){
           toast.success("Blog added successfully");
            setImage(null);
            setData({title:"",description:"",category:"Startup",authorImg:"/profile_icon.png"});
        }else{
              toast.error("Error in adding blog");
        }
           
        }
    return (   
        <>
         <form className="pt-5 px-5 sm:pt-12 sm:pl-16" onSubmit={onSubmitHandler} onKeyDown={(e) => {
    if (e.key === "Enter" && e.target instanceof HTMLElement && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  }}>
            <p className="text-xl">Upload thumbnail</p>
            <label  htmlFor="image">
                <Image className="mt-4" src={image?URL.createObjectURL(image):assets.upload_area} width={140} height={70} alt=""/>
            </label>
            <input
              onChange={(e) => {
                const files = e.target.files;
                setImage(files && files[0] ? files[0] : null);
              }}
              type="file"
              id="image"
              hidden
              required
            />
            <p className="text-xl mt-4">Blog title</p>
            <input name="title" onChange={onChangeHandler} value={data.title} className="w-full sm:w-[500px] mt-4 px-4 py-3 border" type="text" placeholder="Type here" required />
            <p className="text-xl mt-4">Blog Description</p>
            <Editor onChange={(html) => setData((prev) => ({ ...prev, description: html }))} />

            <p className="text-xl mt-4">Category</p>
            <select onChange={onChangeHandler} value={data.category} className="w-40 mt-4 px-4 py-3 border text-gray-500" name="category">
                <option value="Startup">Startup</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
            </select> <br />
            
            <button type="submit" className="mt-8 w-40 h-12 bg-black text-white hover:bg-white hover:text-black hover:border">Add</button>
         </form>
        </>
    )
}
export default page;