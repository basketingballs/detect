function Loading() {
    return (
        <div role="status" className="h-screen w-screen animate-pulse">
            <div className="fixed top-0 left-0 w-full h-screen">
                <nav className="w-screen">
                    <div className="w-full px- py-5 bg-gray-200 rounded-md dark:bg-gray-400 max-w-[360px] shadow"></div>
                </nav>
                <div className="flex h-screen">
                    <div className="h-screen px-32 bg-gray-200 rounded-md dark:bg-gray-300 max-w-[360px]">
                        <div class="flex items-center justify-between">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                        <div class="flex items-center justify-between pt-4">
                            <div>
                                <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-24 mb-2.5"></div>
                                <div class="w-32 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                            </div>
                            <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-12"></div>
                        </div>
                    </div>
                    <main className="flex-1 p-2 overflow-y-auto">
                        <div className="grid grid-rows-7 grid-flow-col gap-2">
                            <div className="row-span-4 col-span-4 w-full px-4 py-5 bg-gray-200 rounded-md dark:bg-gray-400 max-w-[360px] shadow"></div>
                            <div className="col-span-2 row-span-2 w-full px-10 py-5 bg-gray-200 rounded-md dark:bg-gray-500 max-w-[360px] shadow"></div>
                            <div className="col-span-2 row-span-2 w-full px-10 py-5 bg-gray-200 rounded-md dark:bg-gray-500 max-w-[360px] shadow"></div>
                            <div className="row-span-6 w-full px-4 py-5 bg-gray-200 rounded-md dark:bg-gray-500 max-w-[360px] shadow"></div>
                        </div>
                        <div className="grid grid-cols mt-3 gap-2">
                            <div className="col-span-2 w-full px-4 py-5 bg-gray-200 rounded-md dark:bg-gray-500 max-w-[360px] shadow"></div>
                        </div>
                        <div className="grid grid-rows-3 grid-flow-col mt-3 gap-3">
                            <div className="row-span-3 col-span-6 w-full px-4 py-5 bg-gray-200 rounded-md dark:bg-gray-500 max-w-[360px] shadow"></div>
                            <div className="row-span-4 w-full px-4 py-5 bg-gray-200 rounded-md dark:bg-gray-500 max-w-[360px] shadow"></div>
                        </div>
                        <span className="sr-only">Loading...</span>
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Loading;
