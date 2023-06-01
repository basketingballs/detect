import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';

const LogOutModal = ({ open, setOpen }) => {
    const navigate = useNavigate();
    function logout(){
        localStorage.clear();
        navigate('/login')
    }

    return (
        <Transition show={open} as={Fragment}>
            <Dialog
                as='div'
                className='relative z-10 h'
                onClose={() => {
                    setOpen(false);
                }}
            >
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                >
                    <div className='fixed inset-0 bg-black bg-opacity-25' />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-50'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-50'
                        >
                            <Dialog.Panel className='w-1/3 max-w-6xl h-1/3 min-w-md transform overflow-y-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col'>
                                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                    Are yousure you want to logout?
                                </Dialog.Title>
                                <Dialog.Description as='h5' className='text-sm font-small leading-6 text-gray-700'>
                                    this means you'll have to log back in again!!!
                                </Dialog.Description>
                                <div className='flex flex-grow items-center justify-center'>
                                    <button
                                        onClick={() => {
                                            setOpen(false);
                                        }}
                                        className='bg-indigo-500 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500'
                                    >
                                        cancel
                                    </button>
                                    <button
                                        onClick={logout}
                                        className='bg-red-500 text-white py-3 px-5 rounded lg:ml-8 hover:bg-red-700 duration-500'
                                    >
                                        logout
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default LogOutModal;
