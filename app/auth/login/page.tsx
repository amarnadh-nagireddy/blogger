"use client";
import Link from "next/link";
import React, { useState,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const router = useRouter(); 
  const [user, setUser] = useState({
      email: "",
      password: "",
  });
  useEffect(() => {
          if (
              user.email.length > 0 &&
              user.password.length > 0 
          ) {
              setButtonDisabled(false);
          } else {
              setButtonDisabled(true);
          }
      }, [user]);
  const handleLogin = async () => {
    try {
            
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login successful");
            router.push("/admin");

        }catch (error: unknown) {
            if (!(error instanceof Error)) {
                console.error("Sign up failed", error);
                toast.error("An unknown error occurred"); 
                return;
            }
            console.log("Sign up failed", error.message);
            toast.error(error.message); 
        } 
  }

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }
    try {
      const res = await axios.post("/api/users/forgotpassword", {
        email: forgotEmail,
      });
      toast.success(res.data.message || "Password reset link sent!");
      setShowForgot(false);
    } catch (error: unknown) {
      if (!(error instanceof axios.AxiosError)) {
        console.error("Forgot password failed", error);
        toast.error("An unknown error occurred");
        return;
      }
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold  mb-4">Login</h1>
      
      {/* Your login form here */}
      <input
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="p-2  pr-16 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
      />
      
      <div className="relative flex items-center">
                <input
                className="p-2 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 text-black flex-1"
                id="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
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
      <button   className={`p-2 mt-2 border rounded-lg mb-4 focus:outline-none ${buttonDisabled ? "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-300 focus:border-gray-600"}`}  disabled={buttonDisabled}   onClick={()=>handleLogin()}>
        Login
      </button>

      
      <p className="text-sm">Forgot password? <span className="text-blue-600 text-sm underline"><button onClick={() => setShowForgot(true)}>Reset here</button></span></p>

      {/* Overlay Modal */}
      {showForgot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg mb-4 w-full text-black"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowForgot(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button onClick={handleForgotPassword} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                Send Link
              </button>
            </div>
          </div>
        </div>
  )}
      <p className="text-sm mt-2">{"Don't have an account?" }<span className="text-blue-600 text-base underline"><Link href="/auth/signup">sign up</Link></span></p>
    </div>
  ); 
}
