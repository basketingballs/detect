import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import CreateUnitForm from './CreateUnitForm';

export default function UnitsTable() {
    const [units, SetUnits] = useState([]);
    const [open, setOpen] = useState(false);
    const [openDel, setOpenDel] = useState(false);
    const [delRef, setDelRef] = useState(false);

    const deleteUnit = async (id) => {
        try {
            const options = {
                method: 'POST',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };
            const response = await fetch(`http://localhost:5000/unit/delete/${id}`, options);
            const body = await response.json();

            if (response.ok) {
                toast.success(body);
            } else {
                toast.error(body);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const getUnits = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };
            const response = await fetch(`http://localhost:5000/unit/all`, options);
            const body = await response.json();

            if (response.ok) {
                SetUnits(body);
            } else {
                throw new Error(body);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const createUnit = async () => {
        setOpen(true);
    };

    const getID = (id) => {
        toast.success(id);
    };

    useEffect(() => {
        getUnits();
    }, [openDel, open]);

    return (
        <>
            <CreateUnitForm open={open} setOpen={setOpen} />

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
                                        Do you really want to delete {delRef.name} unit?
                                    </Dialog.Title>
                                    <Dialog.Description as='h5' className='text-sm font-small leading-6 text-gray-700'>
                                        proceed with caution
                                    </Dialog.Description>
                                    <button
                                        onClick={() => {
                                            deleteUnit(delRef.unit_id);
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
            <div className='w-full flex justify-end'>
                <button
                    onClick={createUnit}
                    className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500'
                >
                    Add Unit
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
                            wilaya
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            dayra
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            baladya
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            neighbourhood
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            postal_code
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
                    {units.map((unit) => (
                        <tr key={unit.unit_id}>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.unit_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.wilaya}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.dayra}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.baladya}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.neighbourhood}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.postal_code}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                Dr. {unit.admin_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium whitespace-nowrap'>
                                <button
                                    className='text-green-500 hover:text-green-700'
                                    onClick={() => getID(unit.unit_id)}
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
                                        setDelRef(unit);
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
