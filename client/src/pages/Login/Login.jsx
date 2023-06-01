import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import toast, { Toaster } from 'react-hot-toast';

import LoginForm from './LoginForm';
import ForgotPassword from './ForgotPassword';
import CreateAdminForm from './CreateAdminForm'


export default function Login() {

    const [isLogin, setIsLogin] = useState(true);
    const [isOpen, setIsOpen] = useState(false);


    const checkAccounts = async () => {
        try {
            const response = await fetch('http://localhost:5000/account', { method: 'GET' });
            const jsonData = await response.json();
            if (jsonData == true) {
                toast.success("you're up!");
                setIsOpen(true);
            }
        } catch (err) {
            console.log(err.message)
            toast.error(err.message);
        }
    };

    useEffect(() => {
        checkAccounts();
    }, []);

    function modifyPage() {
        setIsLogin(!isLogin);
    }

    const loginComponent = <LoginForm nav={modifyPage} />;
    const forgotPasswordComponent = <ForgotPassword nav={modifyPage} />;

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    return (
        <>
            <Toaster />
            <Transition show={isOpen} as={Fragment}>
                <Dialog as='div' className='relative z-10 h' onClose={closeModal}>
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
                                <Dialog.Panel className='w-full max-w-6xl min-w-md transform overflow-y-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                        Looks like you're the first one
                                    </Dialog.Title>
                                    <Dialog.Description as='h5' className='text-sm font-small leading-6 text-gray-700'>
                                        You can create a system admin account
                                    </Dialog.Description>
                                    <CreateAdminForm control={closeModal} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className='flex flex-col items-center justify-center h-[100vh] overflow-hidden'>
                {isLogin ? loginComponent : forgotPasswordComponent}
            </div>
        </>
    );
}
