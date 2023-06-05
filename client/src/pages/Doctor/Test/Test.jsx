import React, { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import toast from 'react-hot-toast';

import PersonService from '../../../service/PersonServices';

export default function Test() {
    const [User, setUser] = useState(JSON.parse(localStorage.getItem('user data')));

    const [info, setInfo] = useState({});
    const [status, setStatus] = useState(0);
    const [id, setID] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [gender, setGender] = useState(null);
    const [date, setDate] = useState(null);

    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('+213');

    const [wilaya, setWilaya] = useState('');
    const [allWilaya, setAllWilaya] = useState([]);
    const [wilayaText, setWilayaText] = useState('wilaya');
    const [dayra, setDayra] = useState('');
    const [baladya, setBaladya] = useState('');
    const [neighbourhood, setNeighbourhood] = useState('');

    const [isSmoker, setIsSmoker] = useState(null);
    const [diet, setDiet] = useState(null);

    const [postal_code, setPostal_code] = useState('');
    const [form1Status, setForm1] = useState(true);
    const [form2Status, setForm2] = useState(true);
    const [form3Status, setForm3] = useState(true);
    const [form4Status, setForm4] = useState(true);

    const [errors, setErrors] = useState({
        id: '',
        name: '',
        lastname: '',
        gender: '',
        date: '',

        email: '',
        phone: '',

        wilaya: '',
        dayra: '',
        baladya: '',
        neighbourhood: '',
        postal_code: '',

        isSmoker: '',
        diet: '',
    });

    const formValidation = () => {
        setForm1(true);
        setForm2(true);
        setForm3(true);
        setForm4(true);
        let localErrors = {
            id: '',
            name: '',
            lastname: '',
            gender: '',
            date: '',

            email: '',
            phone: '',

            wilaya: '',
            dayra: '',
            baladya: '',
            neighbourhood: '',
            postal_code: '',

            isSmoker: '',
            diet: '',
        };

        if (isNaN(id)) {
            localErrors.id = 'id must be a valid number';
            setForm1(false);
        } else if (id.length !== 6) {
            localErrors.id = 'id must be a 6 chars long';
            setForm1(false);
        }

        if (!name.trim()) {
            localErrors.name = 'Name is required.';
            setForm1(false);
        }

        if (!lastname.trim()) {
            localErrors.lastname = 'Lastname is required.';
            setForm1(false);
        }

        if (gender == null) {
            localErrors.gender = 'gender is required';
            setForm1(false);
        }
        if (date == null) {
            localErrors.date = 'a birthdate is required';
            setForm1(false);
        }

        if (!email.trim()) {
            localErrors.email = 'Email is required.';
            setForm1(false);
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            localErrors.email = 'Invalid email address.';
            setForm2(false);
        }

        if (!phone.trim()) {
            localErrors.phone = 'Phone number is required.';
            setForm2(false);
        } else if (!/\+213[5-7][0-9]{8}$/.test(phone)) {
            localErrors.phone = 'Invalid phone number.';
            setForm2(false);
        }

        if (wilayaText == 'wilaya') {
            localErrors.wilaya = 'wilaya is required.';
            setForm3(false);
        }
        if (!dayra.trim()) {
            localErrors.dayra = 'dayra is required.';
            setForm3(false);
        }
        if (!baladya.trim()) {
            localErrors.baladya = 'baladya is required.';
            setForm3(false);
        }
        if (!neighbourhood.trim()) {
            localErrors.neighbourhood = 'neighbourhood is required.';
            setForm3(false);
        }
        if (postal_code == 0 || isNaN(postal_code)) {
            localErrors.postal_code = 'postal_code is required.';
            setForm3(false);
        }

        if (isSmoker == null) {
            localErrors.isSmoker = 'required.';
            setForm4(false);
        }

        if (diet == null) {
            localErrors.diet = 'required.';
            setForm4(false);
        }

        setErrors(localErrors);
        const Globalstatus = form1Status && form2Status && form3Status && form4Status;
        return Globalstatus;
    };

    const create = async () => {
        if (formValidation()) {
            const data = {
                id: id,
                name: name,
                lastname: lastname,
                gender: gender,
                date: date,

                email: email,
                phone: phone,

                wilaya: wilaya,
                dayra: dayra,
                baladya: baladya,
                neighbourhood: neighbourhood,
                postal_code: neighbourhood,

                is_smoker: isSmoker,
                diet: diet,

                data: info,
            };
            try {
                const response = await PersonService.createSubject(data);
                toast.success(response.data.message);
            } catch (err) {
                toast.error(err.response.data.message);
            }
        } else {
            toast.error('form invalid');
        }
    };

    const initState = async () => {
        try {
            const response = await fetch(`http://localhost:5000/doctor/info/${User.id}`);
            const body = await response.json();
            setInfo(body);
            if (body.unit_id == null) {
                setStatus(4);
            }
            if (body.unit_id != null && body.lab_id == null) {
                setStatus(5);
            }
        } catch (err) {
            console.log(err.message);
        }
    };
    const getWilayas = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };
            const response = await fetch('http://localhost:5000/unit/wilaya', options);
            const body = await response.json();
            if (response.ok) {
                setAllWilaya(body);
            } else {
                toast.error(body);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    const getPerson = async (id) => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };
            const response = await fetch(`http://localhost:5000/subject/person/${id}`, options);
            const body = await response.json();

            if (response.ok) {
                if (body == 'new') {
                    toast('seems that this is a new person');
                } else {
                    setName(body[0].first_name)
                    setLastname(body[0].last_name)
                    setDate(body[0].birthdate)
                    setGender(body[0].is_male)
                }
            } else {
                toast.error(body);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    useEffect(() => {
        initState();
        getWilayas();
    }, []);
    return (
        <div className='w-full flex-grow bg-white rounded-md shadow p-12'>
            <div className='w-full h-5 flex items-center justify-center p-12 my-5'>
                <div
                    className={`flex-1 m-1 h-2 bg-green-500 flex items-center justify-center rounded-full ${
                        status == 0 ? 'bg-yellow-500 ' : ''
                    }${form1Status ? '' : 'bg-red-600'}`}
                ></div>
                <div
                    className={`flex-1 m-1 h-2 bg-green-500 flex items-center justify-center rounded-full ${
                        status == 1 ? 'bg-yellow-500 ' : ''
                    }${form2Status ? '' : 'bg-red-600'}`}
                ></div>
                <div
                    className={`flex-1 m-1 h-2 bg-green-500 flex items-center justify-center rounded-full ${
                        status == 2 ? 'bg-yellow-500 ' : ''
                    }${form3Status ? '' : 'bg-red-600'}`}
                ></div>
                <div
                    className={`flex-1 m-1 h-2 bg-green-500 flex items-center justify-center rounded-full ${
                        status == 3 ? 'bg-yellow-500 ' : ''
                    }${form4Status ? '' : 'bg-red-600'}`}
                ></div>
            </div>
            {status == 0 && (
                <>
                    <div className='w-full text-center text-3xl font-sans text-slate-700 pb-4 capitalize'>
                        Personal Information
                    </div>
                    <form>
                        <div className='grid grid-cols-2 mb-6 mx-4 gap-12 py-8'>
                            <div className='relative h-11 w-full min-w-[200px]'>
                                <input
                                    type='text'
                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                    placeholder=' '
                                    value={id}
                                    onChange={(e) => {
                                        if (e.target.value.length <= 6 && !isNaN(e.target.value)) setID(e.target.value);
                                        if (e.target.value.length == 6) getPerson(e.target.value);
                                    }}
                                />
                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    ID Card Number
                                </label>
                                {errors.id != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.id}</div>
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
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.name}</div>
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
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.lastname}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className='relative h-11 w-full min-w-[200px]'>
                                <input
                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                    type='date'
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                                <label
                                    htmlFor='floatingInput'
                                    className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                                >
                                    Birth date
                                </label>
                                {errors.date != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.date}</div>
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
                                            id='gender'
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
                                                <circle data-name='ellipse' cx='8' cy='8' r='8'></circle>
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
                                            id='gender'
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
                                                <circle data-name='ellipse' cx='8' cy='8' r='8'></circle>
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
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.gender}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div className='w-full flex justify-end'>
                            <button
                                onClick={() => setStatus(1)}
                                className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500 '
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </>
            )}
            {status == 1 && (
                <>
                    <div className='w-full text-center text-3xl font-sans text-slate-700 pb-4 capitalize'>
                        Contact Information
                    </div>
                    <form>
                        <div className='flex flex-col  gap-12 px-32 py-8'>
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
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.phone}</div>
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
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.email}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div className='w-full flex justify-between'>
                            <button
                                onClick={() => setStatus(0)}
                                className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500 '
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStatus(2)}
                                className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500 '
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </>
            )}
            {status == 2 && (
                <>
                    <div className='w-full text-center text-3xl font-sans text-slate-700 pb-4 capitalize'>
                        Residence Information
                    </div>
                    <form>
                        <div className='grid grid-cols-2 mb-6 mx-4 gap-12 py-8 '>
                            <div className='relative h-11 w-full min-w-[200px] w-full'>
                                <Menu as='div' className='relative inline-block text-left w-full'>
                                    <div>
                                        <Menu.Button className='ring-indigo ring-1 flex justify-between gap-8 text-black py-3 px-2 rounded w-full'>
                                            <span className='capitalized'>{wilayaText}</span>
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
                                            </svg>
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
                                        <Menu.Items className='absolute left-0 mt-2 w-56 h-36 z-10 overflow-y-scroll origin-top-right divide-y divide-gray-900 rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none'>
                                            <div className='px-1 py-1'>
                                                {allWilaya.map((wilaya) => (
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                type='button'
                                                                className={`${
                                                                    active
                                                                        ? 'bg-violet-500 text-black'
                                                                        : 'text-gray-900'
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                                onClick={() => {
                                                                    setWilayaText(wilaya.wilaya_name);
                                                                }}
                                                            >
                                                                {wilaya.wilaya_name}
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                ))}
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                                {errors.wilaya != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.wilaya}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className='relative h-11 w-full min-w-[200px]'>
                                <input
                                    type='text'
                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                    placeholder=' '
                                    value={dayra}
                                    onChange={(e) => setDayra(e.target.value)}
                                />
                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Dayra
                                </label>
                                {errors.dayra != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.dayra}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className='relative h-11 w-full min-w-[200px]'>
                                <input
                                    type='text'
                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                    placeholder=' '
                                    value={baladya}
                                    onChange={(e) => setBaladya(e.target.value)}
                                />
                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Baladya
                                </label>
                                {errors.baladya != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.baladya}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className='relative h-11 w-full min-w-[200px]'>
                                <input
                                    type='text'
                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                    placeholder=' '
                                    value={neighbourhood}
                                    onChange={(e) => setNeighbourhood(e.target.value)}
                                />
                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Neighbourhood
                                </label>
                                {errors.neighbourhood != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.neighbourhood}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className='relative h-11 w-full min-w-[200px]'>
                                <input
                                    type='text'
                                    className='peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-indigo-500 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50'
                                    placeholder=' '
                                    value={postal_code}
                                    onChange={(e) => setPostal_code(e.target.value)}
                                />
                                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-indigo-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-indigo-900 peer-focus:after:scale-x-100 peer-focus:after:border-indigo-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                                    Postal Code
                                </label>
                                {errors.postal_code != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.postal_code}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div className='w-full flex justify-between'>
                            <button
                                onClick={() => setStatus(1)}
                                className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500 '
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setStatus(3)}
                                className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500 '
                            >
                                Next
                            </button>
                        </div>
                    </form>
                </>
            )}
            {status == 3 && (
                <>
                    <div className='w-full text-center text-3xl font-sans text-slate-700 pb-4 capitalize'>
                        Test Related Information
                    </div>
                    <form>
                        <div className='grid grid-cols-2 mb-6 mx-4 gap-12 py-8 '>
                            <div className='flex gap-10'>
                                <div className='inline-flex items-center'>
                                    <label
                                        className='mt-px cursor-pointer select-none font-sans text-gray-700'
                                        htmlFor='html'
                                    >
                                        Is subject a smoker?
                                    </label>
                                    <label
                                        className='relative flex cursor-pointer items-center rounded-full p-3'
                                        htmlFor='html'
                                        data-ripple-dark='true'
                                    >
                                        <input
                                            id='smoker'
                                            name='smoker'
                                            type='radio'
                                            onClick={() => setIsSmoker(false)}
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                        />
                                        <div className='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                className='h-3.5 w-3.5'
                                                viewBox='0 0 16 16'
                                                fill='currentColor'
                                            >
                                                <circle data-name='ellipse' cx='8' cy='8' r='8'></circle>
                                            </svg>
                                        </div>
                                    </label>
                                    <label
                                        className='mt-px cursor-pointer select-none font-sans text-gray-700'
                                        htmlFor='html'
                                    >
                                        No
                                    </label>
                                </div>
                                <div className='inline-flex items-center'>
                                    <label
                                        className='relative flex cursor-pointer items-center rounded-full p-3'
                                        htmlFor='react'
                                        data-ripple-dark='true'
                                    >
                                        <input
                                            id='smoker'
                                            name='smoker'
                                            type='radio'
                                            onClick={() => setIsSmoker(true)}
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                        />
                                        <div className='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-blue-500 opacity-0 transition-opacity peer-checked:opacity-100'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                className='h-3.5 w-3.5'
                                                viewBox='0 0 16 16'
                                                fill='currentColor'
                                            >
                                                <circle data-name='ellipse' cx='8' cy='8' r='8'></circle>
                                            </svg>
                                        </div>
                                    </label>
                                    <label
                                        className='mt-px cursor-pointer select-none font-sans text-gray-700'
                                        htmlFor='react'
                                    >
                                        Yes
                                    </label>
                                </div>
                                {errors.gender != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.gender}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className='flex gap-10'>
                                <div className='inline-flex items-center'>
                                    <label
                                        className='mt-px cursor-pointer select-none font-sans text-gray-700'
                                        htmlFor='html'
                                    >
                                        Did Subject Eat in the Last 12 hours?
                                    </label>
                                    <label
                                        className='relative flex cursor-pointer items-center rounded-full p-3'
                                        htmlFor='html'
                                        data-ripple-dark='true'
                                    >
                                        <input
                                            id='diet'
                                            name='diet'
                                            type='radio'
                                            onClick={() => setDiet(false)}
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                        />
                                        <div className='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-pink-500 opacity-0 transition-opacity peer-checked:opacity-100'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                className='h-3.5 w-3.5'
                                                viewBox='0 0 16 16'
                                                fill='currentColor'
                                            >
                                                <circle data-name='ellipse' cx='8' cy='8' r='8'></circle>
                                            </svg>
                                        </div>
                                    </label>
                                    <label
                                        className='mt-px cursor-pointer select-none font-sans text-gray-700'
                                        htmlFor='html'
                                    >
                                        No
                                    </label>
                                </div>
                                <div className='inline-flex items-center'>
                                    <label
                                        className='relative flex cursor-pointer items-center rounded-full p-3'
                                        htmlFor='react'
                                        data-ripple-dark='true'
                                    >
                                        <input
                                            id='diet'
                                            name='diet'
                                            type='radio'
                                            onClick={() => setDiet(true)}
                                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-full border border-blue-gray-200 text-blue-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
                                        />
                                        <div className='pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-blue-500 opacity-0 transition-opacity peer-checked:opacity-100'>
                                            <svg
                                                xmlns='http://www.w3.org/2000/svg'
                                                className='h-3.5 w-3.5'
                                                viewBox='0 0 16 16'
                                                fill='currentColor'
                                            >
                                                <circle data-name='ellipse' cx='8' cy='8' r='8'></circle>
                                            </svg>
                                        </div>
                                    </label>
                                    <label
                                        className='mt-px cursor-pointer select-none font-sans text-gray-700'
                                        htmlFor='react'
                                    >
                                        Yes
                                    </label>
                                </div>
                                {errors.gender != ' ' ? (
                                    <div style={{ textAlign: 'left', color: 'orangered' }}>{errors.gender}</div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div className='w-full flex justify-between'>
                            <button
                                onClick={() => setStatus(2)}
                                className='bg-indigo-700 text-white py-3 px-5 rounded lg:ml-8 hover:bg-blue-900 duration-500 '
                            >
                                Previous
                            </button>
                            <button
                                type='button'
                                onClick={() => create()}
                                className='bg-green-600 text-white py-3 px-5 rounded lg:ml-8 hover:bg-green-900 duration-500 '
                            >
                                Validate
                            </button>
                        </div>
                    </form>
                </>
            )}
            {(status == 4 || status == 5) && (
                <div className='w-full text-center text-3xl font-sans text-slate-700 pb-4 capitalize'>
                    You're not affacted to a campaign for the moment
                    <br />
                    <br />
                    sit back and relax
                </div>
            )}
        </div>
    );
}
