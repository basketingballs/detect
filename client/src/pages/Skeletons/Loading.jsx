function Loading() {
  return (
    <div role="status" className=" h-screen w-screen flex items-center justify-center animate-pulse">
      <div className=" bg-gray-200 rounded-lg dark:bg-gray-700 w-1/2 h-1/2"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Loading;
