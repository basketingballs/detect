import React from 'react';
import ApexCharts from 'react-apexcharts';

function AreaChart() {
  const options = {
  //    fill: {
  //   type: 'gradient',
  //   gradient: {
  //     shade: 'light',
  //     type: 'vertical',
  //     shadeIntensity: 0.5,
  //     gradientToColors: ['#FDD835'],
  //     inverseColors: false,
  //     opacityFrom: 0.8,
  //     opacityTo: 0.5,
  //     stops: [0, 100]
  //   }
  // },
    series: [
      {
        name: 'series1',
        data: [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: 'series2',
        data: [11, 32, 45, 32, 34, 52, 41],
      },
    ],
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'datetime',
      categories: [
        '2018-09-19T00:00:00.000Z',
        '2018-09-19T01:30:00.000Z',
        '2018-09-19T02:30:00.000Z',
        '2018-09-19T03:30:00.000Z',
        '2018-09-19T04:30:00.000Z',
        '2018-09-19T05:30:00.000Z',
        '2018-09-19T06:30:00.000Z',
      ],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
    legend: {
      show: false
    },
  };

  return (
    <div className='bg-white pt-3 mx-2 rounded-md shadow'>
      <div className="text-md font-medium text-slate-800 ml-3 pb-2">
          Area Chart
      </div>
      <hr className='pb-4 border-blue-800'/>
      <ApexCharts options={options} className="mr-6 flex-wrap" series={options.series} type="area" height={options.chart.height} />
    </div>
  );
}

export default AreaChart;
