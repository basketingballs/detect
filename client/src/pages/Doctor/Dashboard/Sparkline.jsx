import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import 'apexcharts/dist/apexcharts.css';

function LineChart() {
  const [chartOptions, setChartOptions] = useState({
    series: [{
      data: [25, 66, 41, 89, 63, 25, 44, 12, 36, 9, 54]
    }],
    chart: {
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.6
      },
      sparkline: {
        enabled: true
      }
    },
    colors: ['#f8fafc'],
    stroke: {
      width: 1,
      curve: 'smooth',
    },
    tooltip: {
      fixed: {
        enabled: false
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function (seriesName) {
            return ''
          }
        }
      },
      markers: {
        size: 1,
      }
    }
  });

  return (
    <ReactApexChart options={chartOptions} series={chartOptions.series} type="line" className="mt-5 flex justify-center" width={160} height={35} />
  );
}

export default LineChart;
