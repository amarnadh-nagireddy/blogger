"use client"
import axios from 'axios';

import React, {useEffect, useState} from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
export default function Page(){
    const [token, setToken]=useState("");
    const [showPassword, setShowPassword]=useState(false);
    const [buttonDisabled, setButtonDisabled]=useState(true);
    const [password,setPassword]=useState("");
    const router=useRouter();
    const resetPassword=async()=>{
        try {
           await  axios.post('/api/users/resetpassword',{token,password});
           toast.success("Password reset successful") 
           router.push("/auth/login")
        } catch (error: unknown) {
                toast.error("Failed to reset password");

            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
            } else {
                console.error("Unexpected error:", error);
            }
         }

    }
    useEffect(()=>{
        setToken(window.location.search.split('=')[1])
    },[]);
     useEffect(() => {
              if (password.length > 0) {
                  setButtonDisabled(false);
              } else {
                  setButtonDisabled(true);
              }
          }, [password]);

    return(
         <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-2xl font-bold  mb-4">Reset Password</h1>
             <div className="relative flex items-center">
                <input
                className="p-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black flex-1"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                />
                <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-sm text-blue-600"
                >
                {showPassword ? "Hide" : "Show"}
                </button>
  
            </div>
      <button   className={`p-2 mt-2 border rounded-lg mb-4 focus:outline-none ${buttonDisabled ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-300 focus:border-gray-600"}`}  disabled={buttonDisabled}   onClick={()=>resetPassword()}>
        Reset Password
      </button>
        </div>
    )

}