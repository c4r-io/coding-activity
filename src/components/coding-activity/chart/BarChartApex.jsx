import React, { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const BarChartApex = ({ data }) => {
    const [chartData, setChartData] = React.useState({
        series: [{
            name: 'Servings',
            data: [...data.map(({ label, value }) => label)]
        }],
        options: {

            tooltip: {
                enabled: false,
            },
            chart: {
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    borderRadius: 10,
                    columnWidth: '50%',
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 0
            },
            grid: {
                row: {
                    colors: ['#00000000', '#f2f2f200']
                }
            },
            xaxis: {
                labels: {
                    rotate: -45
                },
                categories: [...data.map(({ label, value }) => 3)
                ],
            },
        }
    });
    useEffect(() => {
        setChartData(
            {
                series: [{
                    name: 'Servings',
                    data: [...data.map(({ name, value }) => value)]
                }],
                options: {

                    tooltip: {
                        enabled: false,
                    },
                    chart: {
                        height: 350,
                        type: 'bar',
                    },
                    plotOptions: {
                        bar: {
                            borderRadius: 10,
                            columnWidth: '50%',
                        }
                    },
                    dataLabels: {
                        enabled: false
                    },
                    stroke: {
                        width: 0
                    },
                    grid: {
                        row: {
                            colors: ['#00000000', '#f2f2f200']
                        }
                    },
                    xaxis: {
                        labels: {
                            rotate: -45
                        },
                        categories: [...data.map(({ label, value }) => label)
                        ],
                    },
                }
            }
        )
    }, [data]);
    return (
        <div>
            <div id="chart" className='bg-white'>
                <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={450} />
            </div>
        </div>
    );
};
export default BarChartApex;