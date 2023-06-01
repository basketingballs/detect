import React from 'react'
import team from '../../assets/team.png'

const OurTeam = () => {

    const myClass = 'w-full px-20 py- bg-white rounded-md drop-shadow-2xl';
    const classClass = 'mt-4 grid justify-items-stretch w-full text-center px-4 mb-10 bg-red-200/30 rounded-md drop-shadow-2xl';
    const divClass = 'text-2xl font-sans text-slate-900 truncate';

    return (
        <div className="d-flex container-fluid flex-col">
            <main className="p-4 overflow-y-auto">
                <div className="mx-8 my-12">
                    <div className={myClass}>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <div className="w-full md:w-1/2 md:px-4">
                                <div className='text-9xl ml-8 mb-28 font-semibold text-red-500 drop-shadow-2xl'>
                                    Meet Our
                                    Team
                                </div>
                                <div className="text-justify text-slate-800 font-sans text-2xl mb-4">
                                    Welcome in our team !
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 md:text-center md:px-4">
                                <img src={team} alt="Logo" className="w-full h-auto drop-shadow-2xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 grid-flow-row mb-8 gap-6">
                            <div className={classClass}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1}
                                    stroke="currentColor"
                                    className="justify-self-center h-16"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
                                    />
                                </svg>

                                <div className={divClass}>
                                    Knowledge Base
                                </div>
                                <hr className='my-4 border-gray-200 sm:mx-auto px-8 dark:border-slate-900' />
                                <div className="flex flex-col space-y-2 cursor-pointer">
                                    <ul className='text-justify text-slate-900 leading-relaxed'>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            Campaign Planning Guide: A Step-by-Step Approach to Colorectal Cancer Screening Campaigns
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            Data Collection and Analysis Best Practices for Colorectal Cancer Screening Campaigns
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            Effective Communication Strategies for Promoting Colorectal Cancer Screening
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            Understanding the Role of Epidemiology in Colorectal Cancer Prevention
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            Latest Research Findings on Colorectal Cancer Screening Methods
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={classClass}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1}
                                    stroke="currentColor"
                                    className="justify-self-center h-16"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                    />
                                </svg>
                                <div className={divClass}>
                                    FaQs
                                </div>
                                <hr className='my-4 border-gray-200 sm:mx-auto px-8 dark:border-slate-900' />
                                <div className="flex flex-col cursor-pointer">
                                    <ul className='text-justify text-slate-900 leading-relaxed'>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            How do I create a new campaign in the application?
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            What are the system requirements to use the application?
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            How can I import data from external sources into the application?
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            Is my data secure and protected within the application?
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            How can I generate reports and analyze campaign data?
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className={classClass}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1}
                                    stroke="currentColor"
                                    className="justify-self-center h-16"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                    />
                                </svg>
                                <div className={divClass}>
                                    More Questions ?
                                </div>
                                <hr className='my-4 border-gray-200 sm:mx-auto px-8 dark:border-slate-900' />
                                <div className="flex flex-col cursor-pointer">
                                    <ul className='text-justify text-slate-900 leading-relaxed'>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            If you have any specific questions or need personalized support, please contact our team at [detectplusplus@proton.me]. We're here to assist you!
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            For inquiries regarding partnership opportunities or collaboration, please reach out to our team.
                                        </li>
                                        <li className='hover:bg-red-800/10 px-4 py-2 rounded-lg'>
                                            If you encountered a technical issue or have feedback to share, please don't hesitate to contact us. Your input is valuable in improving our application.
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default OurTeam