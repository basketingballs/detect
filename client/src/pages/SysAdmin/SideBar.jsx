import { useState } from 'react';

import LogOutModal from '../LogOutModal';

function Icon({ id, open }) {
    return (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            className={`${id === open ? 'rotate-180' : ''} h-6 w-6 p-1 transition-transform`}
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
            strokeWidth={2}
        >
            <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
    );
}

export default function SideBar({ setComponent }) {
    const [activeComponent, setActiveComponent] = useState('dashboard');

    const handleComponentClick = (componentName) => {
        setActiveComponent(componentName);
    };

    const [logout, setLogout] = useState(false);
    const [open, setOpen] = useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };
    return (
        <nav className='absolute left-0 top-16 bottom-0 w-[250px] flex overflow-y-auto px-6 py-4 bg-white shadow'>
            <LogOutModal open={logout} setOpen={setLogout} />
            <div className='flex-1'>
                <ul className='pt-2 pb-4 space-y-4 text-sm text-gray-700'>
                    <li className='hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md'>
                        <button
                            onClick={() => {
                                setComponent('dashboard');
                            }}
                            className='flex items-center p-2 w-full space-x-3 font-semibold rounded-md'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='w-6 h-6'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
                                />
                            </svg>
                            <span>Dashboard</span>
                        </button>
                    </li>
                    <li className='hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md'>
                        <button
                            onClick={() => {
                                setComponent('accounts');
                            }}
                            className='flex items-center p-2 w-full space-x-3 font-semibold rounded-md'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth='1.5'
                                stroke='currentColor'
                                className='w-6 h-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z'
                                />
                            </svg>

                            <span>Accounts</span>
                        </button>
                    </li>
                    <li className='hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md'>
                        <button
                            onClick={() => {
                                setComponent('campaign');
                            }}
                            className='flex items-center p-2 w-full space-x-3 font-semibold rounded-md'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={1.5}
                                stroke='currentColor'
                                className='w-6 h-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46'
                                />
                            </svg>

                            <span>Campaign</span>
                        </button>
                    </li>
                    <li className='hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md'>
                        <button
                            onClick={() => {
                                setComponent('chart');
                            }}
                            className='flex items-center p-2 w-full space-x-3 font-semibold rounded-md'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='w-6 h-6'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z'
                                />
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z'
                                />
                            </svg>

                            <span>Chart</span>
                        </button>
                    </li>
                    <li className='hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md'>
                        <button
                            onClick={() => {
                                setComponent('reports');
                            }}
                            className='flex items-center p-2 w-full space-x-3 font-semibold rounded-md'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth={2}
                                stroke='currentColor'
                                className='w-6 h-6'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12'
                                />
                            </svg>

                            <span>Reports</span>
                        </button>
                    </li>

                    <li className='hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md'>
                        <button
                            onClick={() => {
                                setComponent('help');
                            }}
                            className='flex items-center p-2 w-full space-x-3 font-semibold rounded-md'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='w-6 h-6'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
                                />
                            </svg>

                            <span>Help</span>
                        </button>
                    </li>
                    <hr />
                    <li className='hover:bg-gray-700 hover:text-gray-100 px-2 rounded-md'>
                        <button
                            onClick={() => {
                                setLogout(true);
                            }}
                            className='flex items-center p-2 w-full space-x-3 font-semibold rounded-md'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='w-6 h-6'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1'
                                />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
