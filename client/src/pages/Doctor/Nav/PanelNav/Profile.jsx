import React , { useState } from "react";
import femaledoctor from '../../../../assets/femaledoctor.jpg'

const Profile = () => {
      const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user data"))
  );
    return (
        <>
            <div className='flex items-center space-x-4 p-6'>
                <span className='text-xl'>Your Account</span>
            </div>
            <div className='flex flex-col items-center justify-center space-y-4 p-2'>
                <img src={femaledoctor} alt="head_doc" className="w-20 h-20 rounded-full" />
                <button className='text-md uppercase bg-gray-200 px-6 py-2 hover:bg-gray-400 rounded-md'>Edit photo</button>
            </div>
            <hr className='my-1 mx-10 border-slate-200' />
            <div className='flex items-center px-6 py-2'>
                <span className='text-md'>Name</span>
            </div>
            <div className='flex justify-between px-6 py-3'>
                <div className='flex items-center text-md font-medium'>{user.name}</div>
                <button className='text-md uppercase bg-gray-200 px-6 py-2 hover:bg-gray-400 rounded-md'>edit</button>
            </div>
            <hr className='my-1 mx-10 border-slate-200' />
            <div className='flex items-center px-6 py-2'>
                <span className='text-md '>Lastname</span>
            </div>
            <div className='flex justify-between px-6 py-3'>
                <div className='flex items-center text-md font-medium'>{user.lastname}</div>
                <button className='text-md uppercase bg-gray-200 px-6 py-2 hover:bg-gray-400 rounded-md'>edit</button>
            </div>
            <hr className='my-1 mx-10 border-slate-200' />
            <div className='flex items-center px-6 py-2'>
                <span className='text-md '>Email</span>
            </div>
            <div className='flex justify-between px-6 py-3'>
                <div className='flex items-center text-md font-medium'>{user.email}</div>
                <button className='text-md uppercase bg-gray-200 px-6 py-2 hover:bg-gray-400 rounded-md'>edit</button>
            </div>
            <hr className='my-1 mx-10 border-slate-200' />
            <div className='py-28'></div>
        </>
    )
}

export default Profile