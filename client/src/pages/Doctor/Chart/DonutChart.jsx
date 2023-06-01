import React from 'react';
import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';

export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [25, 15, 44, 55, 41],
      options: {
        chart: {
          width: '100%',
          type: 'donut',
        },
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        colors: ['#ecfeff', '#a5f3fc', '#67e8f9', '#0891b2', '#155e75'],
        fill: {
          opacity: 0.8
        },
        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex]
            return [name, val.toFixed(1) + '%']
          }
        },
      },
      responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
          }
        }],
        legend: {
          show: false
        }
    };
  }

  render() {
    return (
        <div id="chart" className='bg-white pt-3 mx-2 rounded-md shadow'>
              <div className="text-md font-medium text-slate-800 pl-4 pb-2">
                  Doughnut Chart
              </div>
              <hr className='pb-4 border-blue-800'/>
        <ReactApexChart options={this.state.options} series={this.state.series} type="donut" />
      </div>
    );
  }
}
