import { NextRequest, NextResponse } from "next/server";
import ConnectDB from "@/lib/config/db";
import { writeFile } from "fs/promises";
import BlogModel from "@/lib/models/BlogModel";
import jwt from "jsonwebtoken";
const fs=require("fs");
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    
});

const LoadDB = async () => {
    await ConnectDB();
}
LoadDB();



export async function GET(request: NextRequest) {
  const blogId = request.nextUrl.searchParams.get("id");
  const token = request.cookies.get("token")?.value;

  console.log("Token:", blogId);

  try {
    if (blogId) {
      // Blog by ID (either public or authorized)
      const blog = await BlogModel.findById(blogId);
      if (!blog) {
        return NextResponse.json({ message: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog, { status: 200 });
    }

    if (token) {
      const secret = process.env.TOKEN_SECRET;
      if (!secret) throw new Error("TOKEN_SECRET not set");

      const decoded = jwt.verify(token, secret) as { id: string };
      const blogs = await BlogModel.find({ authorId: decoded.id });
      return NextResponse.json({ blogs }, { status: 200 });
    }

    // No token and no blogId: return all blogs (public access)
    const blogs = await BlogModel.find({});
    return NextResponse.json({ blogs }, { status: 200 });

  } catch (err) {
    console.error("Error fetching blogs:", err);
    return NextResponse.json({ message: "Failed to fetch blogs" }, { status: 500 });
  }
}





export async function POST(request: any) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
        const userId = (decoded as { id: string }).id;

        

        const formData = await request.formData();
        const timeStamp = Date.now();

        
        const image = formData.get("image") as File;
        const imageByteData = await image.arrayBuffer();
        const buffer = Buffer.from(imageByteData);
        const res=await new Promise<any>((resolve, reject)=>{
            const uploadStream=cloudinary.uploader.upload_stream({folder:"blog_images"}, (error:any, result:any)=>{
                if(error) reject(error);
                else resolve(result);

            })
            uploadStream.end(buffer);
          });
        const imageUrl = res.secure_url;
          
      
        const blogData = {
            title: formData.get("title"),
            description: formData.get("description"),
            category: formData.get("category"),
            authorId: userId,            
            image: imageUrl,
            authorImg: formData.get("authorImg"),
        };

        
        await BlogModel.create(blogData);
        console.log("Blog saved");

        return NextResponse.json({ success: true, message: "Blog Added", blogData }, { status: 201 });

    } catch (err: any) {
        console.error("Error saving blog:", err);
        return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}

export async function PUT(request: any) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    const userId = decoded.id;

    const blogId = request.nextUrl.searchParams.get("id");
    if (!blogId) {
      return NextResponse.json({ success: false, message: "Blog ID required" }, { status: 400 });
    }

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    // Check if the logged-in user is the author
    if (blog.authorId.toString() !== userId) {
      return NextResponse.json({ success: false, message: "You can only update your own blog" }, { status: 403 });
    }

    const formData = await request.formData();

    // Update fields
    blog.title = formData.get("title")?.toString() || blog.title;
    blog.description = formData.get("description")?.toString() || blog.description;
    blog.category = formData.get("category")?.toString() || blog.category;
    blog.authorImg = formData.get("authorImg")?.toString() || blog.authorImg;

    const image = formData.get("image") as File | null;
    if (image) {
      // Delete old image if exists
      if (blog.image) {
        fs.unlink(`./public/${blog.image.split("/").pop()}`, () => {});
      }

      const timeStamp = Date.now();
      const imageByteData = await image.arrayBuffer();
      const buffer = Buffer.from(imageByteData);
      const path = `./public/${timeStamp}_${image.name}`;
      await writeFile(path, buffer);
      blog.image = `/${timeStamp}_${image.name}`;
    }

    await blog.save();
    return NextResponse.json({ success: true, message: "Blog updated successfully", blog }, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: err.message || "Something went wrong" }, { status: 500 });
  }
}


export async function DELETE(request: any) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
  
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as { id: string };
    const userId = decoded.id;

    const blogId = request.nextUrl.searchParams.get("id");
    if (!blogId) {
      return NextResponse.json({ success: false, message: "Blog ID missing" }, { status: 400 });
    }

    const blog = await BlogModel.findById(blogId);
    if (!blog) {
      return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 });
    }

    if (blog.authorId.toString() !== userId) {
      return NextResponse.json({ success: false, message: "You are not authorized to delete this blog" }, { status: 403 });
    }

    
    if (blog.image) {
      fs.unlink(`./public/${blog.image}`, (err:any) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }
    await BlogModel.findByIdAndDelete(blogId);

    return NextResponse.json({ success: true, message: "Blog deleted successfully" }, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to delete blog" }, { status: 500 });
  }
}