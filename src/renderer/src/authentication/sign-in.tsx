/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import logo from "@renderer/assets/login-pic.jpg"

export default function Signin(): React.ReactElement {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        console.log('username:', username)
        console.log('password:', password)
    }

    return (
        <div className="flex flex-row bg-white justify-center items-center h-screen ">
            <div className='flex flex-1 justify-center items-center '>
                <img src={logo} alt="" className='' />
            </div>
            <div className=" flex-1 p-4">
                <div className='mb-6'>
                    <h1 className='font-serif font-semibold text-5xl '>Login</h1>
                </div>
                <div className='mb-6'>
                    <span className='text-gray-400 '>Welcome back! please login to your account.</span>
                </div>
                <form>
                    <div className='mb-8'>
                        <label className='block text-sm' htmlFor="username">Username</label>
                        <input
                            name='username'
                            type="text"
                            placeholder="Username"
                            id='username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="border border-gray-300 rounded-xl p-2 w-[80%]  mt-2"
                        />
                    </div>
                    <div className='mb-8'>
                        <label className='block text-sm' htmlFor="password">Password</label>
                        <input
                            name='password'
                            id='password'
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-gray-300 rounded-xl p-2 w-[80%]  mt-2"
                        />
                    </div>
                    <div className='mb-4'>
                        <button
                            onSubmit={(e) => handleSubmit(e)}
                            type="submit"
                            className="bg-blue-500 font-serif text-white p-2 rounded-xl w-[80%] mt-2"
                        >
                            Login
                        </button>
                    </div>
                    <div className='mb-4'>
                        <a href="/" className="text-blue-500 mt-2">Forgot password?</a>
                    </div>
                    <div>
                        <p className='text-sm'>New User? <a className='text-blue-500' href="/signup">Sign Up</a></p>
            
                    </div>
                </form>
            </div>

        </div>
    )
}
