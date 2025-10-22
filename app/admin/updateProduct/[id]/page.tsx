"use client";
import React,{useState,useEffect, use, ChangeEvent, FormEvent} from "react";

import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import Editor from "@/Components/AdminComponents/Editor";
import { useRouter } from "next/navigation";

const  Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const { id } = use(params);
  
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "",
    authorImg: "/profile_icon.png",
  });
  

 useEffect(() => {
  if (!id) return;

  const fetchBlog = async () => {
    try {
      const res = await axios.get(`/api/blog`, {params: { id }});
      const blog = res.data;
    
      setData({
        title: blog.title,
        description: blog.description,
        category: blog.category,
        authorImg: blog.authorImg,
      });
      
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        toast.error(`Error: ${err.response.data.message}`);
        return;
      }
      toast.error("Failed to fetch blog");
    }
  };

  fetchBlog();
}, [id]);

  const onChangeHandler = (e:ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("authorImg", data.authorImg);
   

    try {
      const res = await axios.put('/api/blog/',formData, { params: { id } });
      if (res.data.success) {
        toast.success("Blog updated successfully");
        router.push("/admin/blogList"); 
      } else {
        toast.error("Error updating blog");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response) {
        toast.error(`Error: ${err.response.data.message}`);
        return;
      }
      toast.error("An unexpected error occurred");

    }
  };

  return (
    <form className="pt-5 px-5 sm:pt-12 sm:pl-16" onSubmit={onSubmitHandler} onKeyDown={(e) => {
    if (e.key === "Enter" && e.target instanceof HTMLElement && e.target.tagName !== "TEXTAREA") {
      e.preventDefault();
    }
  }}>
      <p className="text-xl mt-4">Blog title</p>
      <input name="title" onChange={onChangeHandler} value={data.title ?? ""} className="w-full sm:w-[500px] mt-4 px-4 py-3 border" type="text" placeholder="Type here" required />
      <p className="text-xl mt-4">Blog Description</p>
      <Editor
        value={data.description}
        onChange={(html) =>
          setData((prev) => ({ ...prev, description: html }))
        }
      />

       <p className="text-xl mt-4">Category</p>
            <select onChange={onChangeHandler} value={data.category} className="w-40 mt-4 px-4 py-3 border text-gray-500" name="category">
                <option value="Startup">Startup</option>
                <option value="Technology">Technology</option>
                <option value="Lifestyle">Lifestyle</option>
            </select> <br />
            
            <button type="submit" className="mt-8 w-40 h-12 bg-black text-white hover:bg-white hover:text-black hover:border">Add</button>
         </form>
  );
};

export default Page;
