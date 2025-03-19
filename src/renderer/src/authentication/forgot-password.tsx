/* eslint-disable prettier/prettier */
import React, { useState } from 'react';

export default function ForgotPassword(): React.ReactElement {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        console.log("here")
        console.log('email:', email);
    };

    return (
        <div className="flex flex-col bg-white justify-center items-center h-screen">
            <div className="">
                <div className='mb-6 text-center'>
                    <h1 className='font-serif font-bold text-3xl text-center'>Forgot Password</h1>
                </div>
                <div className='mb-6 text-center'>
                    <span className='text-gray-400 '>No worries, we will send you reset instructions.</span>
                </div>
                <div className='flex flex-col '>
                    <div className='mb-8 w-full flex flex-col '>
                        <label className='block text-sm text-left' htmlFor="email">Email</label>
                        <input
                            name='email'
                            type="email"
                            placeholder="Email"
                            id='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-gray-300 rounded-xl p-2 w-full mt-2 mx-auto"
                        />
                    </div>
                    <div className='mb-4 w-full flex flex-col items-center'>
                        <button
                            onClick={(e) => handleSubmit(e)}
                            type="submit"
                            className="bg-blue-500 font-serif text-white p-2 rounded-xl w-full mt-2"
                        >
                            Reset Password
                        </button>
                    </div>
                    <div className='mb-4  w-full text-center'>
                        <a href="/login" className="text-black mt-2">{"<- back to login"}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}