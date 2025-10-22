"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true); 
    
    const onSignup = async () => {
        try {
            
            const response = await axios.post("/api/users/signup", user);
            console.log("Sign up success", response.data);
            router.push("/auth/login");

        }catch (error: unknown) {
            if (!(error instanceof Error)) {
                console.error("Sign up failed", error);
                toast.error("An unknown error occurred"); 
                return;
            }
            console.log("Sign up failed", error.message);
            toast.error(error.message); 
        } 
    };
    
    // This effect enables the signup button only when all fields are filled [2].
    useEffect(() => {
        if (
            user.email.length > 0 &&
            user.password.length > 0 &&
            user.username.length > 0
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="mb-2 font-bold  text-2xl">Sign Up</h1>
            <hr />
            
            <input
                className="p-2 pr-16 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Username"
                required
            />
            
            <input
                className="p-2  pr-16 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Email"
                required
            />
           
                
            <div className="relative flex items-center">
                <input
                className="p-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black flex-1"
                id="password"
                type={showPassword ? "text" : "password"}
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
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

            <button onClick={onSignup} className={`p-2 mt-2 border rounded-lg mb-4 focus:outline-none ${buttonDisabled ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-300 focus:border-gray-600"}`}  disabled={buttonDisabled}>
               sign up
            </button>
            <p className="text-sm">Already has an account? <span className="text-blue-600 text-base underline"><Link href="/auth/login">click here</Link></span></p>
        </div>
    );
}