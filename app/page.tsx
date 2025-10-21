"use client";

import Header from "@/Components/Header";
import BlogList from "@/Components/BlogList";
import Footer from "@/Components/Footer";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer theme="dark" />
      <Header />
      
      
      <main className="flex-grow">
        <BlogList />
      </main>
      
      <Footer />
    </div>
  );
}
