import React from "react";
import ReactDOM from "react-dom";
import ReactApexChart from "react-apexcharts";

export default class ApexChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [25, 15, 44, 31, 56],
      options: {
        chart: {
          width: "100%",
          type: "pie",
        },
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        colors: ["#fff7ed", "#ffedd5", "#fdba74", "#f97316", "#c2410c"],
        fill: {
          opacity: 0.8,
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -5,
            },
          },
        },

        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex];
            return [name, val.toFixed(1) + "%"];
          },
        },
        legend: {
          show: false,
        },
      },
    };
  }

  render() {
    return (
      <div id="chart" className="bg-white pt-3 mx-2 rounded-md shadow">
        <div className="text-md font-medium text-slate-800 pl-4 pb-2">
          Pie Chart
        </div>
        <hr className="pb-4 border-blue-800" />
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="pie"
        />
      </div>
    );
  }
}
