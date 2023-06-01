import React , {useState} from "react";
import { Link } from 'react-router-dom'
import Eventsimage from "../../assets/Eventsimage.jpg";

const Events = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="w-full relative bg-indigo-900/30">
      <img src={Eventsimage} alt="Logo" className="w-full h-auto bg-scroll" />
      <div className="absolute top-48 left-16 p-4 text-white outline outline-offset-4 bg-black bg-opacity-50 drop-shadow-2xl">
        <h2 className="text-8xl font-semibold">Together to <p className='text-indigo-500 text-9xl'>Fight</p>Cancer</h2>
        <div className={`md:flex justify-center md:m-10 my-2 items-left ${isOpen ? 'flex' : 'hidden'}`}>
          {
            !JSON.parse(localStorage.getItem('user data')) ? (
              <Link
                to={'/login'}
                className='bg-indigo-800 text-white py-4 px-8 rounded hover:bg-indigo-800 duration-500'
              >
                Get Started
              </Link>
            ) : (
              <button className='bg-indigo-700 text-white py-4 px-12 text-xl rounded hover:bg-indigo-900 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300'>
                Get Started
              </button>
            )
          }
        </div>
      </div>
      <div>
        <h2 className="text-center text-red font-semibold text-8xl py-10">Any questions ?</h2>
        <div className="flex justify-around">
          <form className='my-6 flex'>
            <input
              type="text"
              className="block w-full px-44 pl-2 text-sm rounded-lg bg-slate-50 border-gray-300 focus:border-transparent focus:ring-gray-500"
              placeholder="Put your mail here ..."
            />
            <button
              className="ml-2 px-10 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-800 shadow-xl text-white"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Events;
