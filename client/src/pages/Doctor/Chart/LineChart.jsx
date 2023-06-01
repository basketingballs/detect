import React, { Component } from "react";
import Chart from "react-apexcharts";

class ChartComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        series: [
          {
            name: "High - 2013",
            data: [28, 29, 33, 36, 32, 32, 33]
          },
          {
            name: "Low - 2013",
            data: [12, 11, 14, 18, 17, 13, 13]
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.6
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#155e75', '#1e293b'],
        fill: {
          opacity: 0.5
        },
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth'
        },
        
        markers: {
          size: 1
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        yaxis: {
          min: 5,
          max: 40
        },
        legend: {
          show: false
        }
      }
    };
  }

  render() {
    return (
      <div className='bg-white pt-3 mx-2 rounded-md shadow'>
        <div className="text-md font-medium text-slate-800 ml-3 pb-2">
          Line Chart
      </div>
      <hr className='pb-8 border-blue-800'/>
        <Chart options={this.state.options} series={this.state.options.series} type="line" height={350} />
      </div>
    );
  }
}

export default ChartComponent;
