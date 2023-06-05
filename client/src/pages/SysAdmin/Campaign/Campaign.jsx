import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import AddUnits from './AddUnits';
import AddLab from './AddLab';
import AddDoctor from './AddDoctor';

import PersonService from '../../../service/PersonServices';

export default function Campaign() {
    const [campaign, setCampaign] = useState({});
    const [units, SetUnits] = useState([]);
    const [inactiveUnits, SetInactiveUnits] = useState([]);
    const [activeLab, setActiveLab] = useState([]);
    const [labHistory, setLabHistory] = useState([]);
    const [activeDoc, setActiveDoc] = useState([]);
    const [docHistory, setDocHistory] = useState([]);
    const [tests, setTests] = useState([]);
    const [openUnits, setOpenUnits] = useState(false);
    const [openLab, setOpenLab] = useState(false);
    const [openDelLab, setOpenDelLab] = useState(false);
    const [openDoc, setOpenDoc] = useState(false);
    const [openDelDoc, setOpenDelDoc] = useState(false);
    const [addRef, setAddRef] = useState(0);
    const [delRef, setDelRef] = useState(0);
    const getCampaign = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };

            const response = await fetch(`http://localhost:5000/sysadmin/campaign`, options);
            const body = await response.json();
            body.created_date = body.created_date.split('T')[0];
            body.start_date = body.start_date.split('T')[0];
            setCampaign(body);
            const buffer = {
                body: body,
                created: new Date().toISOString(),
            };
            sessionStorage.setItem('campaign', JSON.stringify(buffer));
        } catch (err) {
            console.error(err.message);
        }
    };

    const initCampaign = async () => {
        try {
            const buffer = await JSON.parse(sessionStorage.getItem('campaign'));
            if (!buffer || Math.floor((new Date() - new Date(buffer.created)) / (1000 * 60)) > 0) {
                getCampaign();
            } else {
                setCampaign(buffer.body);
            }
        } catch (err) {
            console.error(err.message);
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

            const response = await fetch(`http://localhost:5000/sysadmin/campaign/unit`, options);
            const body = await response.json();
            SetUnits(body.active);
            SetInactiveUnits(body.inactive);
        } catch (err) {
            console.error(err.message);
        }
    };

    const getLabs = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };

            const response = await fetch(`http://localhost:5000/sysadmin/unit/lab`, options);
            if (response.status == 200) {
                const body = await response.json();
                setLabHistory(body.inactive);
                setActiveLab(body.active);
            }
        } catch (err) {
            console.error(err.message);
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

            const response = await fetch(`http://localhost:5000/sysadmin/unit/doc`, options);
            if (response.status == 200) {
                const body = await response.json();
                setDocHistory(body.inactive);
                setActiveDoc(body.active);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const getTests = async () => {
      try{
        const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };

            const response = await fetch(`http://localhost:5000/subject/tests`, options);
            const body = await response.json();
            if (response.ok) {
                console.log(body);
                setTests(body);
            }
            else{
              toast.error(body)
            }
      }catch(err){
              toast.error(err.message)

      }
    }

    const unlinkUnitLab = async (camp_unit_id, lab_id) => {
        try {
            const response = await PersonService.removeUnitLab({
                camp_unit_id: camp_unit_id,
                lab_id: lab_id,
            });
            toast.success(response.data.message);
        } catch (err) {
            console.error(err);
        }
    };

    const removeDoc = async (doctor_id) => {
        try {
            const response = await PersonService.removeUnitDoc({
                doctor_id: doctor_id,
            });
            toast.success(response.data.message);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getCampaign();
        getUnits();
        getLabs();
        getDoctors();
        getTests()
    }, [openUnits, openDelLab, openLab, openDoc, openDelDoc]);

    return (
        <div className=' shadow-xl rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 w-full flex flex-col items-center '>
            <Transition show={openUnits} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-10 h'
                    onClose={() => {
                        setOpenUnits(false);
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

                    <div className='fixed inset-0 overflow-auto-y'>
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
                                <Dialog.Panel className='transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title
                                        as='h3'
                                        className='text-xl text-center font-medium leading-6 text-slate-700'
                                    >
                                        Add unit to this campaign
                                    </Dialog.Title>
                                    <AddUnits unitList={units} setOpen={setOpenUnits} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className='w-full flex flex-col justify-between p-5 gap-5'>
                <span className='text-2xl flex flex-col justify-center w-full items-center font-medium font-bold text-slate-700 uppercase'>
                    {campaign.name}
                </span>
                <span className='text-xl flex flex-col justify-center w-full items-center font-small text-slate-700 uppercase'>
                    {campaign.description}
                </span>
                <div className='w-full flex flex-col items-start'>
                    <span>Created on : {campaign.created_date}</span>
                    <span>Started on : {campaign.start_date}</span>
                    <span>
                        status :{' '}
                        {campaign.status != 4
                            ? 'ongoing'
                            : `Ended on : ${campaign.end_date == null ? 'unknown' : campaign.end_date.split('T')[0]}`}
                    </span>
                    <span> by : Dr. {campaign.admin_name}</span>
                    <div className='flex gap-5'>
                        <span>target age : {campaign.min_age} and above</span>
                        <button>
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
                        </button>{' '}
                    </div>
                </div>
            </div>

            <div className='flex justify-between w-full'>
                <span className='text-xl flex flex-col justify-center items-center font-small text-slate-700 mx-12'>
                    {units.length} Active Units
                </span>
                <button
                    onClick={() => setOpenUnits(true)}
                    className='tbg-white text-indigo-600 py-3 px-5 rounded-2xl lg:ml-8 ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 ring-2 duration-500 mx-12'
                >
                    manage
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
                            adress
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Lab
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Active doctors
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Add Doctors
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            start Date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            end Date
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {units.map((unit) => (
                        <tr key={unit.unit_id}>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.camp_unit_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.baladya},{unit.wilaya}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {!unit.lab_name ? (
                                    <button
                                        onClick={() => {
                                            setAddRef(unit);
                                            setOpenLab(true);
                                        }}
                                        className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500'
                                    >
                                        Link Lab
                                    </button>
                                ) : (
                                    unit.lab_name
                                )}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.active_doctors}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                <button
                                    onClick={() => {
                                        setAddRef(unit);
                                        setOpenDoc(true);
                                    }}
                                    className='bg-green-400 text-white py-3 px-5 rounded lg:ml-8 hover:bg-green-600 duration-500'
                                >
                                    Add doctor to unit
                                </button>
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.start_date.split('T')[0]}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                ongoing
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-between w-full'>
                <span className='text-xl flex flex-col justify-center items-center font-small text-slate-700 uppercase mx-12'>
                    Unit History
                </span>
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
                            adress
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Participated Doctors
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            start Date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            end Date
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {inactiveUnits.map((unit) => (
                        <tr key={unit.camp_unit_id} className='bg-red-100'>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.camp_unit_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.baladya},{unit.wilaya}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.active_doctors}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.start_date.split('T')[0]}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {unit.end_date.split('T')[0]}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Transition show={openLab} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-10 h'
                    onClose={() => {
                        setOpenLab(false);
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

                    <div className='fixed inset-0 overflow-auto-y'>
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
                                <Dialog.Panel className='transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                        Link Lab to {addRef.name} unit
                                    </Dialog.Title>
                                    <AddLab unit={addRef} setOpen={setOpenLab} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className='flex justify-between w-full'>
                <span className='text-xl flex flex-col justify-center items-center font-small text-slate-700 uppercase mx-12'>
                    {activeLab.length} Active Labs
                </span>
            </div>
            <table className=' w-full divide-y divide-gray-200 m-5 border rounded-lg'>
                <thead className='bg-indigo-50'>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Id
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Unit Name
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Laboratory
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            start Date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            end Date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            unlink
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {activeLab.map((lab) => (
                        <tr key={lab.unit_lab_id}>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.unit_lab_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.unit_name}
                            </td>

                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.lab_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.start_date.split('T')[0]}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.end_date ? lab.end_date.split('T')[0] : 'ongoing'}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                <button
                                    onClick={() => {
                                        setOpenDelLab(true);
                                        setDelRef(lab);
                                    }}
                                    className='bg-red-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-red-900 duration-500'
                                >
                                    UnLink Lab
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Transition show={openDelLab} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-10 h'
                    onClose={() => {
                        setOpenDelLab(false);
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

                    <div className='fixed inset-0 overflow-auto-y'>
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
                                <Dialog.Panel className='transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all w-1/3'>
                                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                        Unlink Laboratory {delRef.lab_name} from unit {delRef.unit_name}
                                    </Dialog.Title>
                                    <div className='w-full flex justify-center items-center m-8'>
                                        <button
                                            onClick={() => {
                                                unlinkUnitLab(delRef.camp_unit_id, delRef.lab_id);
                                            }}
                                            className='bg-red-700 text-white py-3 px-5 rounded hover:bg-red-900 duration-500'
                                        >
                                            UnLink Lab
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className='flex justify-between w-full'>
                <span className='text-xl flex flex-col justify-center items-center font-small text-slate-700 uppercase mx-12'>
                    Laboratories-unit history
                </span>
            </div>
            <table className=' w-full divide-y divide-gray-200 m-5 border rounded-lg'>
                <thead className='bg-indigo-50'>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Id
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Unit Name
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Laboratory
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            start Date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            end Date
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {labHistory.map((lab) => (
                        <tr key={lab.unit_lab_id} className='bg-red-100'>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.unit_lab_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.unit_name}
                            </td>

                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.lab_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.start_date.split('T')[0]}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {lab.end_date ? lab.end_date.split('T')[0] : 'ongoing'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Transition show={openDoc} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-10 h'
                    onClose={() => {
                        setOpenDoc(false);
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

                    <div className='fixed inset-0 overflow-auto-y'>
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
                                <Dialog.Panel className='transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                        Link Dcotor to {addRef.name} unit
                                    </Dialog.Title>
                                    <AddDoctor unit={addRef} activeDocs={activeDoc} setOpen={setOpenDoc} />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className='flex justify-between w-full'>
                <span className='text-xl flex flex-col justify-center items-center font-small text-slate-700 uppercase mx-12'>
                    {activeDoc.length} Active Doctors in this campaign
                </span>
            </div>
            <table className=' w-full divide-y divide-gray-200 m-5 border rounded-lg'>
                <thead className='bg-indigo-50'>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Id
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Unit Name
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Doctor
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            start Date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            end Date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            unlink
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {activeDoc.map((doctor) => (
                        <tr key={doctor.unit_doc_id}>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.unit_doc_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.unit_name}
                            </td>

                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                Dr. {doctor.first_name} {doctor.last_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.start_date.split('T')[0]}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.end_date ? doctor.end_date.split('T')[0] : 'ongoing'}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                <button
                                    onClick={() => {
                                        setOpenDelDoc(true);
                                        setDelRef(doctor);
                                    }}
                                    className='bg-red-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-red-900 duration-500'
                                >
                                    Remove doctor from unit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Transition show={openDelDoc} as={Fragment}>
                <Dialog
                    as='div'
                    className='relative z-10 h'
                    onClose={() => {
                        setOpenDelDoc(false);
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

                    <div className='fixed inset-0 overflow-auto-y'>
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
                                <Dialog.Panel className='transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all w-1/3'>
                                    <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                        Unlink Laboratory {delRef.lab_name} from unit {delRef.unit_name}
                                    </Dialog.Title>
                                    <div className='w-full flex justify-center items-center m-8'>
                                        <button
                                            onClick={() => {
                                                removeDoc(delRef.doctor_id);
                                            }}
                                            className='bg-red-700 text-white py-3 px-5 rounded hover:bg-red-900 duration-500'
                                        >
                                            remove Doctor
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
            <div className='flex justify-between w-full'>
                <span className='text-xl flex flex-col justify-center items-center font-small text-slate-700 uppercase mx-12'>
                    Doctor-Unit history
                </span>
            </div>
            <table className=' w-full divide-y divide-gray-200 m-5 border rounded-lg'>
                <thead className='bg-indigo-50'>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Id
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Unit Name
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Doctor
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            start Date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            end Date
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {docHistory.map((doctor) => (
                        <tr key={doctor.unit_doc_id} className='bg-red-100'>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.unit_doc_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.unit_name}
                            </td>

                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                Dr. {doctor.first_name} {doctor.last_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.start_date.split('T')[0]}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {doctor.end_date ? doctor.end_date.split('T')[0] : 'ongoing'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='flex justify-between w-full'>
                <span className='text-xl flex flex-col justify-center items-center font-small text-slate-700 uppercase mx-12'>
                    {tests.length} Tests done in this campaign
                </span>
            </div>
            <table className=' w-full divide-y divide-gray-200 m-5 border rounded-lg'>
                <thead className='bg-indigo-50'>
                    <tr>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            test id
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            subject
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            date
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            Doctor
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            unit
                        </th>
                        <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            laboratory
                        </th>
                         <th scope='col' className='px-6 py-3 text-xs font-bold text-center text-gray-500 uppercase '>
                            test result
                        </th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-200'>
                    {tests.map((test) => (
                        <tr key={test.test_id} className='bg-red-100'>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {test.test_id}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {test.first_name} {test.last_name} 
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {test.test_date.split('T')[0]} 
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                Dr. {test.doctor_name} {test.doctor_lastname}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {test.unit_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {test.lab_name}
                            </td>
                            <td className='px-3 py-4 text-sm text-center font-medium text-gray-800 whitespace-nowrap'>
                                {test.test_result}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
