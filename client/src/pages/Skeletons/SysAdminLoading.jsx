function Loading() {
    return (
        <div className='h-screen w-screen animate-pulse relative'>
            <nav className='w-full h-16 bg-gray-200 rounded-md dark:bg-gray-400 shadow'></nav>
            <div className='flex absolute top-16 right-0 left-0 bottom-0'>
                <nav className='h-full w-full flex flex-col gap-12 bg-gray-200 rounded-md dark:bg-gray-300 max-w-[360px]'>
                    <div className='w-full flex items-center justify-around pt-5'>
                        <div className='h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
                        <div className='h-5 w-36 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
                    </div>
                    <div className='w-full flex items-center justify-around'>
                        <div className='h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
                        <div className='h-5 w-36 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
                    </div>
                    <div className='w-full flex items-center justify-around '>
                        <div className='h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
                        <div className='h-5 w-36 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
                    </div>
                    <div className='w-full flex items-center justify-around '>
                        <div className='h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
                        <div className='h-5 w-36 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5'></div>
                    </div>
                </nav>
                <main className='flex-1 p-2 overflow-y-auto relative'>
                        <div className=' ml-12 mt-8 w-full h-10 bg-gray-200 rounded-md dark:bg-gray-400 max-w-[360px] shadow'></div>
                        <div className=' m-12 bg-gray-200 rounded-md dark:bg-gray-400 absolute top-16 left-0 right-0 bottom-0  shadow'></div>
                </main>
            </div>
        </div>
    );
}

export default Loading;
