"use client"

import { useRouter } from "next/navigation";
import React, { useState } from "react"

export default function LoginPage(){
    const [data, setData] = useState({ email: "", password: "" });
    const [load, setLoad] = useState(false)
    const [error, setError] = useState("")

    const router = useRouter();
    
    async function handleLogin(e: React.FormEvent){
        e.preventDefault();

        setError("")
        setLoad(false)

        try{
            const res = await fetch("/api/auth/login",{
                "method": "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            })

            const serverRes = await res.json()

            if(!res.ok){
                setError(serverRes.message)
                console.log(serverRes)
                return;
            }
            router.push(`/${serverRes.data.role.toLowerCase()}/`)
        }
        catch(err){
            setError("something went wrong")
            console.error(`${err instanceof Error ? err.message : "unknown error"}`)
        }finally{
            setLoad(false)
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        setData({...data, [e.target.name]: e.target.value})
    }

    return (
         <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Login to your account</p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="admin@test.com"
              required
              className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>


          <button
            type="submit"
            disabled={load}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {load ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
    )
}