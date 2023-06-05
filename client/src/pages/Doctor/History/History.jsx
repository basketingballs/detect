import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const History = () => {
  const [tests, setTests] = useState([])

  const getTests = async () => {
        try {
            const options = {
                method: 'GET',
                headers: {
                    authorization: `${JSON.parse(localStorage.getItem('token'))}`,
                },
            };

            const response = await fetch(`http://localhost:5000/subject/tests/doctor`, options);
            const body = await response.json();
            if (response.ok) {
                setTests(body);
            } else {
                toast.error(body);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };
    useEffect(() => {

        getTests();
    }, []);

  return (
    <div className="w-full flex-grow bg-white rounded-lg drop-shadow-2xl p-12">
      <div className='flex justify-between w-full'>
                <span className='text-xl flex flex-col justify-center items-center font-small text-slate-700 uppercase mx-12'>
                    {tests.length} Tests done by you!
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
                            campaign
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
                        <tr key={test.test_id} className={`${test.test_result_id != 0 ? 'bg-white' : 'bg-red-100'}`}>
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
                                {test.camp_name}
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
};

export default History;
