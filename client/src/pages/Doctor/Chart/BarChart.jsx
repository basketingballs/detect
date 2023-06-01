import React from 'react';
import ApexCharts from 'react-apexcharts';

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        series: [{
          name: 'Net Profit',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
          name: 'Revenue',
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
        }, {
          name: 'Free Cash Flow',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
    
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands"
            }
          }
        },
        legend: {
          show: false
        },
      },
    };
  }

  render() {
    return (
      <div id="chart" className='bg-white pt-3 mx-2 rounded-md shadow'>
        <div className="text-md font-medium text-slate-800 ml-3 pb-2">
          Bar Chart
        </div>
        <hr className='pb-4 border-blue-800'/>
        <ApexCharts options={this.state.options} series={this.state.options.series} type="bar" height={350} />
      </div>
    );
  }
}

export default Chart;
