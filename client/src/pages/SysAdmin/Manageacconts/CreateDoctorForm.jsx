import React, { Fragment, useState, useEffect } from 'react';
import { Menu, Dialog, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import PersonService from '../../../service/PersonServices';

const MIN_PASSWORD_LENGTH = 8;

const CreateDoctorForm = ({ open, setOpen }) => {
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+213');
    const [gender, setGender] = useState(null);
    const [spec, setSpec] = useState(0);
    const [specText, setSpecText] = useState('speciality');
    const [addSpec, setAddSpec] = useState(false);
    const [allSpecs, setAllSpecs] = useState([]);
    const [bdate, setBDate] = useState(null);

    const reset = () => {
        setID('');
        setName('');
        setLastname('');
        setEmail('');
        setPhone('+213');
        setGender(null);
        setSpecText('speciality');
        setSpec(0);
        setAddSpec(false);
        setAllSpecs([]);
        setBDate(null);
        setErrors({
            id: '',
            name: '',
            lastname: '',
            email: '',
            phone: '',
            spec: '',
            gender: '',
            bdate: '',
        });
    };

    const [errors, setErrors] = useState({
        id: '',
        name: '',
        lastname: '',
        email: '',
        phone: '',
        spec: '',
        gender: '',
        bdate: '',
    });

    const handleValueChange = (newValue) => {
        setValue(newValue);
    };

    const formValidation = () => {
        let status = true;
        let localErrors = {
            id: '',
            name: '',
            lastname: '',
            email: '',
            phone: '',
            spec: '',
            gender: '',
            bdate: '',
        };

        if (isNaN(id)) {
            localErrors.id = 'id must be a valid number';
            status = false;
        } else if (id.length !== 6) {
            localErrors.id = 'id must be a 6 chars long';
            status = false;
        }

        if (!name.trim()) {
            localErrors.name = 'Name is required.';
            status = false;
        }

        if (!lastname.trim()) {
            localErrors.lastname = 'Lastname is required.';
            status = false;
        }

        if (gender == null) {
            localErrors.gender = 'gender is required';
            status = false;
        }
        if (bdate == null) {
            localErrors.bdate = 'a birthdate is required';
            status = false;
        }

        if (!email.trim()) {
            localErrors.email = 'Email is required.';
            status = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            localErrors.email = 'Invalid email address.';
            status = false;
        }

        if (!phone.trim()) {
            localErrors.phone = 'Phone number is required.';
            status = false;
        } else if (!/\+213[5-7][0-9]{8}$/.test(phone)) {
            localErrors.phone = 'Invalid phone number.';
            status = false;
        }

        if (spec == 0) {
            localErrors.spec = 'speciality is required';
            status = false;
        }

        setErrors(localErrors);
        return status;
    };

    const signup = async (e) => {
        e.preventDefault();

        if (formValidation()) {
            //form valide
            const data = {
                id: id,
                name: name,
                lastname: lastname,
                email: email,
                phone: phone,
                speciality: spec,
                gender: gender,
                date: bdate,
            };
            try {
                const response = await PersonService.createDoctor(data);
                toast.success('Successfully created!');
                reset();
                return false;
            } catch (err) {
                toast.error(err.response.data.message);
            }
        } else {
            //else form non valide
            toast.error('form invalid');
        }
    };

    const getSpecs = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };

            const response = await fetch(`http://localhost:5000/doctor/speciality`, options);
            if (response.status == 200) {
                const body = await response.json();
                return setAllSpecs(body);
            } else {
                throw new Error(response);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const addSpeciality = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };
            if (specText == '') {
                toast.error('speciality name cannot be empty');
                return;
            } else if (specText == 'speciality') {
                toast.error('at least change it');
                return;
            }
            const data = {
                name: specText,
            };
            const response = await PersonService.addSpeciality(data);
            toast.success(response.data);
        } catch (err) {
            toast.error(err.response.data);
        }
    };
    useEffect(() => {
        getSpecs();
    }, [open, addSpec]);

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
                            <Dialog.Panel className='w-full max-w-5xl transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                                <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                                    Create a New Doctor
                                </Dialog.Title>

                                <div className='w-full px-5 py-3 bg-white'>
                                    <h1 className='text-4xl font-semibold text-center text-blue-700 pb-4'>
                                        Create Doctor
                                    </h1>
                                    <form>
                                        <div className='grid grid-cols-2 mb-6 mx-4 gap-12 py-8 '>
                                            <div className='relative h-11 w-full min-w-[200px]'>
                                                <input
                                                    type='text'
                                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                    placeholder=' '
                                                    value={id}
                                                    onChange={(e) => {
                                                        if (e.target.value.length <= 6 && !isNaN(e.target.value))
                                                            setID(e.target.value);
                                                    }}
                                                />
                                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                    ID Card Number
                                                </label>
                                                {errors.id != ' ' ? (
                                                    <div style={{ textAlign: 'left', color: 'orangered' }}>
                                                        {errors.id}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className='relative h-11 w-full min-w-[200px]'>
                                                <input
                                                    type='text'
                                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                    placeholder=' '
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                />
                                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                    Name
                                                </label>
                                                {errors.name != ' ' ? (
                                                    <div style={{ textAlign: 'left', color: 'orangered' }}>
                                                        {errors.name}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>

                                            <div className='relative h-11 w-full min-w-[200px]'>
                                                <input
                                                    type='text'
                                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                    placeholder=' '
                                                    value={lastname}
                                                    onChange={(e) => setLastname(e.target.value)}
                                                />
                                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                    Lastname
                                                </label>
                                                {errors.lastname != ' ' ? (
                                                    <div style={{ textAlign: 'left', color: 'orangered' }}>
                                                        {errors.lastname}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className='relative h-11 w-full min-w-[200px]'>
                                                <input
                                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                    type='date'
                                                    value={bdate}
                                                    onChange={(e) => setBDate(e.target.value)}
                                                />
                                                <label
                                                    htmlFor='floatingInput'
                                                    className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                                                >
                                                    Birth date
                                                </label>
                                                {errors.bdate != ' ' ? (
                                                    <div style={{ textAlign: 'left', color: 'orangered' }}>
                                                        {errors.bdate}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className='relative h-11 w-full min-w-[200px]'>
                                                <input
                                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                    placeholder=' '
                                                    value={phone}
                                                    onChange={(e) => {
                                                        if (e.target.value.length >= 4 && e.target.value.length <= 13) {
                                                            setPhone(e.target.value);
                                                        }
                                                    }}
                                                />
                                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                    Phone
                                                </label>
                                                {errors.phone != ' ' ? (
                                                    <div style={{ textAlign: 'left', color: 'orangered' }}>
                                                        {errors.phone}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className='relative h-11 w-full min-w-[200px]'>
                                                <input
                                                    type='email'
                                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                    placeholder=' '
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                />
                                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                                    Email
                                                </label>
                                                {errors.email != ' ' ? (
                                                    <div style={{ textAlign: 'left', color: 'orangered' }}>
                                                        {errors.email}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className='relative h-11 w-full min-w-[200px] flex gap-2 items-center justify-center'>
                                                <Menu as='div' className='relative inline-block text-left'>
                                                    <div>
                                                        {addSpec ? (
                                                            <div className='relative h-11 w-32 flex justify-between items-center'>
                                                                <input
                                                                    type='text'
                                                                    className='peer ring-indigo ring-1 rounded h-full w-full bg-transparent font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                                                    placeholder=' '
                                                                    value={specText}
                                                                    onChange={(e) => setSpecText(e.target.value)}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <Menu.Button className='ring-indigo ring-1 flex justify-between gap-8 text-black py-3 px-2 rounded w-32'>
                                                                {!addSpec ? (
                                                                    <>
                                                                        <span className='capitalized'>{specText}</span>
                                                                        <svg
                                                                            xmlns='http://www.w3.org/2000/svg'
                                                                            fill='none'
                                                                            viewBox='0 0 24 24'
                                                                            strokeWidth={1.25}
                                                                            stroke='currentColor'
                                                                            className='w-6 h-6'
                                                                        >
                                                                            <path
                                                                                strokeLinecap='round'
                                                                                strokeLinejoin='round'
                                                                                d='M19.5 8.25l-7.5 7.5-7.5-7.5'
                                                                            />
                                                                        </svg>{' '}
                                                                    </>
                                                                ) : (
                                                                    ''
                                                                )}
                                                            </Menu.Button>
                                                        )}
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
                                                        <Menu.Items className='absolute left-0 mt-2 w-56 h-20 overflow-y-scroll origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none'>
                                                            <div className='px-1 py-1'>
                                                                {allSpecs.map((Spec) => (
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <button
                                                                                type='button'
                                                                                className={`${
                                                                                    active
                                                                                        ? 'bg-violet-500 text-white'
                                                                                        : 'text-gray-900'
                                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                                                onClick={() => {
                                                                                    setSpec(Spec.speciality_id);
                                                                                    setSpecText(Spec.name);
                                                                                }}
                                                                            >
                                                                                {Spec.name}
                                                                            </button>
                                                                        )}
                                                                    </Menu.Item>
                                                                ))}
                                                            </div>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>

                                                {addSpec ? (
                                                    <>
                                                        <button
                                                            type='button'
                                                            className='bg-green-500 h-10 w-10 text-black hover:text-white hover:bg-green-700 duration-300 ring-1 ring-black flex items-center justify-center rounded-md text-sm'
                                                            onClick={() => {
                                                                addSpeciality();
                                                                setSpecText('speciality');
                                                                getSpecs();
                                                                setAddSpec(!addSpec);
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns='http://www.w3.org/2000/svg'
                                                                fill='none'
                                                                viewBox='0 0 24 24'
                                                                strokeWidth={2}
                                                                stroke='currentColor'
                                                                className='w-4 h-4'
                                                            >
                                                                <path
                                                                    strokeLinecap='round'
                                                                    strokeLinejoin='round'
                                                                    d='M4.5 12.75l6 6 9-13.5'
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            type='button'
                                                            className='bg-red-500 h-10 w-10 text-black hover:text-white hover:bg-red-700 duration-300 ring-1 ring-black flex items-center justify-center rounded-md text-sm'
                                                            onClick={() => {
                                                                setSpecText('speciality');
                                                                setAddSpec(!addSpec);
                                                            }}
                                                        >
                                                            <svg
                                                                xmlns='http://www.w3.org/2000/svg'
                                                                fill='none'
                                                                viewBox='0 0 24 24'
                                                                strokeWidth={2}
                                                                stroke='currentColor'
                                                                className='w-4 h-4'
                                                            >
                                                                <path
                                                                    strokeLinecap='round'
                                                                    strokeLinejoin='round'
                                                                    d='M6 18L18 6M6 6l12 12'
                                                                />
                                                            </svg>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type='button'
                                                        className='bg-white h-10 w-10 text-black hover:text-white hover:bg-indigo-700 duration-300 ring-1 ring-black flex items-center justify-center rounded-md text-sm'
                                                        onClick={() => {
                                                            setAddSpec(!addSpec);
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns='http://www.w3.org/2000/svg'
                                                            fill='none'
                                                            viewBox='0 0 24 24'
                                                            strokeWidth={2}
                                                            stroke='currentColor'
                                                            className={`w-4 h-4`}
                                                        >
                                                            <path
                                                                strokeLinecap='round'
                                                                strokeLinejoin='round'
                                                                d='M12 4.5v15m7.5-7.5h-15'
                                                            />
                                                        </svg>
                                                    </button>
                                                )}
                                                {errors.spec != ' ' ? (
                                                    <div style={{ textAlign: 'left', color: 'orangered' }}>
                                                        {errors.spec}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                            <div className='flex gap-10'>
                                                <div className='inline-flex items-center'>
                                                    <label
                                                        className='relative flex cursor-pointer items-center rounded-full p-3'
                                                        htmlFor='html'
                                                        data-ripple-dark='true'
                                                    >
                                                        <input
                                                            id='html'
                                                            name='type'
                                                            type='radio'
                                                            onClick={() => setGender(false)}
                                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-pink-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-pink-500 checked:before:bg-pink-500 hover:before:opacity-10"
                                                        />
                                                        <div className='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100'>
                                                            <svg
                                                                xmlns='http://www.w3.org/2000/svg'
                                                                className='h-3.5 w-3.5'
                                                                viewBox='0 0 16 16'
                                                                fill='currentColor'
                                                            >
                                                                <circle
                                                                    data-name='ellipse'
                                                                    cx='8'
                                                                    cy='8'
                                                                    r='8'
                                                                ></circle>
                                                            </svg>
                                                        </div>
                                                    </label>
                                                    <label
                                                        className='mt-px cursor-pointer select-none font-sans text-gray-700'
                                                        htmlFor='html'
                                                    >
                                                        Female
                                                    </label>
                                                </div>
                                                <div className='inline-flex items-center'>
                                                    <label
                                                        className='relative flex cursor-pointer items-center rounded-full p-3'
                                                        htmlFor='react'
                                                        data-ripple-dark='true'
                                                    >
                                                        <input
                                                            id='react'
                                                            name='type'
                                                            type='radio'
                                                            onClick={() => setGender(true)}
                                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                                        />
                                                        <div className='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-blue-500 opacity-0 transition-opacity peer-checked:opacity-100'>
                                                            <svg
                                                                xmlns='http://www.w3.org/2000/svg'
                                                                className='h-3.5 w-3.5'
                                                                viewBox='0 0 16 16'
                                                                fill='currentColor'
                                                            >
                                                                <circle
                                                                    data-name='ellipse'
                                                                    cx='8'
                                                                    cy='8'
                                                                    r='8'
                                                                ></circle>
                                                            </svg>
                                                        </div>
                                                    </label>
                                                    <label
                                                        className='mt-px cursor-pointer select-none font-sans text-gray-700'
                                                        htmlFor='react'
                                                    >
                                                        Male
                                                    </label>
                                                </div>
                                                {errors.gender != ' ' ? (
                                                    <div style={{ textAlign: 'left', color: 'orangered' }}>
                                                        {errors.gender}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex justify-end items-end'>
                                            <button
                                                type='button'
                                                onClick={()=>{
                                                    setOpen(false)
                                                    reset()}}
                                                className='bg-red-700 text-white py-3 px-16 rounded-lg lg:ml-8 hover:bg-red-900 duration-500'
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type='button'
                                                onClick={signup}
                                                className='bg-indigo-700 text-white py-3 px-16 rounded-lg lg:ml-8 hover:bg-blue-900 duration-500'
                                            >
                                                Create
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default CreateDoctorForm;
