import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Menu, Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CreateDoctorForm from './CreateDoctorForm';

export default function DoctorsTable() {
    const [doctors, setDoctors] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [delRef, setDelRef] = useState(false);

    const deleteDoctor = async (id) => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };
            const response = await fetch(`http://localhost:5000/doctor/delete/${id}`, options);
            const body = await response.json();


            if (response.ok) {
                toast.success(body);
            }
            else{
              toast.error(body)
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const getDoctors = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };
            const response = await fetch(`http://localhost:5000/doctor/all`, options);
            const body = await response.json();

            if (response.ok) {
                setDoctors(body);
            } else {
                throw new Error(body);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };


    const createDoctor = async () => {
        setOpen(true);
    };

    const sortById = () => {
        let sortedArray;
        if (doctors[0].doctor_id < doctors[1].doctor_id)
            sortedArray = [...doctors].sort((a, b) => b.doctor_id - a.doctor_id);
        else sortedArray = [...doctors].sort((a, b) => a.doctor_id - b.doctor_id);
        setDoctors(sortedArray);
    };

    const sortByStatus = () => {
        const sortedArray = [...doctors].sort((a, b) => b.status - a.status);
        setDoctors(sortedArray);
    };

    useEffect(() => {
        getDoctors();
    }, [open,openDel]);

    return (
        <>
            <CreateDoctorForm open={open} setOpen={setOpen} />

            <Transition show={openDel} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-10 h'
                    onClose={() => {
                        setOpenDel(false);
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
                                <Dialog.Panel className='transform overflow-y-scroll rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all flex flex-col items-center'>
                                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                        Do you really want to delete Dr. {delRef.last_name} ?
                                    </Dialog.Title>
                                    <Dialog.Description as='h5' className='text-sm font-small leading-6 text-gray-700'>
                                        proceed with caution
                                    </Dialog.Description>
                                    <button
                                        onClick={() => {
                                            deleteDoctor(delRef.doctor_id);
                                            setOpenDel(false);
                                        }}
                                        className='bg-red-500 text-white py-3 px-5 rounded lg:ml-8 hover:bg-red-700 duration-500 m-5'
                                    >
                                        Delete
                                    </button>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className='w-full flex justify-between'>
                <Menu as='div' className='relative inline-block text-left'>
                    <div>
                        <Menu.Button className='bg-white text-indigo-600 py-3 px-5 rounded-2xl lg:ml-8 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 ring-2 duration-500'>
                            Sort
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom='transform opacity-0 scale-95'
                        enterTo='transform opacity-100 scale-100'
                        leave='transition ease-in duration-75'
                        leaveFrom='transform opacity-100 scale-100'
                        leaveTo='transform opacity-0 scale-95'
                    >
                        <Menu.Items className='absolute left-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                            <div className='px-1 py-1'>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            type='button'
                                            className={`${
                                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            onClick={() => sortById()}
                                        >
                                            by id
                                        </button>
                                    )}
                                </Menu.Item>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            type='button'
                                            className={`${
                                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            onClick={sortByStatus}
                                        >
                                            by status
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
                <button
                    onClick={createDoctor}
                    className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500'
                >
                    Create Doctor
                </button>
            </div>
            <table className=' w-full divide-y divide-gray-200 m-5 border rounded-lg'>
                <thead className='bg-indigo-50'>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Id
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            name
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            lastname
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            spec
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            email
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            created by
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Edit
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {doctors.map((doctor) => (
                        <tr key={doctor.doctor_id}>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.doctor_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.first_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.last_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.speciality}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.email}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                Dr. {doctor.admin_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium whitespace-nowrap'>
                                <button
                                    className='text-green-500 hover:text-green-700'
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
                                            d='M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10'
                                        />
                                    </svg>
                                </button>
                            </td>
                            <td className='px-3 py-4 text-sm font-medium flex items-center justify-center whitespace-nowrap'>
                                <button
                                    type='button'
                                    onClick={() => {
                                        setOpenDel(true);
                                        setDelRef(doctor);
                                    }}
                                    className='text-red-500 text-center hover:text-red-700'
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
                                            d='M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0'
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
