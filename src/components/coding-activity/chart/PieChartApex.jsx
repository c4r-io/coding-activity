import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
const defaultData = [
  { name: "Android", value: 10 },
  { name: "Windows", value: 30 },
  { name: "Mac os", value: 60 },
];
const PieChartApex = ({ data }) => {
  const [chartData, setChartData] = React.useState({
    series: [...data.map(({ label, value }) => value)],
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      labels: [...data.map(({ label, value }) => label)],
      dataLabels: {
        enabled: false
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            show: false
          },
          xaxis: {
            labels: {
              rotate: -45
            },
            categories: [...data.map(({ label, value }) => 3)
            ],
          },
        }
      }],
      legend: {
        position: 'right',
        offsetY: 0,
        height: 230,
      }
    }
  })
  useEffect(() => {
    setChartData({
      series: [...data.map(({ label, value }) => value)],
      options: {
        chart: {
          width: 380,
          type: 'donut',
        },
        labels: [...data.map(({ label, value }) => label)],
        dataLabels: {
          enabled: false
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: false
            },
            xaxis: {
              labels: {
                rotate: -45
              },
              categories: [...data.map(({ label, value }) => 3)
              ],
            },
          }
        }],
        legend: {
          position: 'right',
          offsetY: 0,
          height: 230,
        }
      }
    })
  }, [data])
  return (
    <div>
      <div className="chart-wrap">
        <div id="chart" className='bg-white'>
          <ReactApexChart options={chartData.options} series={chartData.series} type="donut" height={450} />
        </div>
      </div>
    </div>
  );
};

export default PieChartApex;
