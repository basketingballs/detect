import React from 'react';
import { Link } from 'react-router-dom';

import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import DoughnutChart from './DonutChart';
import AreaChart from './AreaChart';
import DonutChart from './DonutChart';

const Chart = () => {
    return (
        <>
            <div className='grid grid-cols-1 mb-3 gap-3'>
                <AreaChart />
            </div>
            <div className='grid grid-cols-2 mb-20 gap-2 space-y-'>
                <PieChart />
                <BarChart />
                <LineChart />
                <DonutChart />
            </div>
        </>
    );
};

export default Chart;
