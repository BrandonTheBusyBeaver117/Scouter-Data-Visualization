import { useEffect, useState } from 'react';

import "./DataChart.scss"

import { Chart as ChartJS, CategoryScale, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from "chart.js"
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend)

export default function DataChart(props) {


    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    //console.log(props.data)
    const [chartData, setChartData] = useState({})

    const [chartOptions, setChartOptions] = useState({})

    useEffect(() => {
        setChartData({
            labels: ["Tova", "Lexie", "Isaac", "Audrey", "Danny"],
            datasets: [
                {
                    label: "idk",
                    data: [12, 55, 34, 120, 720],
                    borderColor: "rgb(53,126,235)",
                    backgroundColor: "rgba(53,126,235, 0.4)"
                }
            ]
        })

        setChartOptions({
            responsive: true,
            plugins: {
                legend: {
                    position: "top"
                },
                title: {
                    display: true,
                    text: "test",
                }
            }
        })

    }, [])

    // useEffect(() => {
    //     console.log("Data Chart ready...?")
    //     if(!props?.data === undefined) {
    //         setData({
    //             labels: ["test1", "test2"],
    //             datasets: [
    //                 {
    //                     label: "Quality (y-axis????)",
    //                     data: [
    //                         ...props.data
    //                     ],
    //                     backgroundColor: [
    //                         "rgba(255, 255, 255, 0.6)"
    //                     ]
    //                 }

    //             ]
    //         })
    //     }

    // }, [props.data])

    const data2 = {
        labels: labels,
        datasets: [{
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
    };

    return (



        <div className='chart'>

            <Line
                className='dataChart'
                datasetIdKey='id'
                data={{
                    labels: ['Jun', 'Jul', 'Aug'],
                    datasets: [
                        {
                            id: 1,
                            label: '',
                            data: [5, 6, 7],
                            backgroundColor: "rgb(100,100,100)"
                        },
                        {
                            id: 2,
                            label: '',
                            data: [3, 2, 1],
                        },
                    ],
                }}
                options={{ maintainAspectRatio: false }}
            />
        </div>
    )

}