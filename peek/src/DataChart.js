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

    console.log(props.teamData)

    return (

        <div className='chart'>

            <Line
                className='dataChart'
                datasetIdKey='id'
                data={{
                    // Should be match numbers
                    labels: props.matches,
                    datasets: [
                        {
                            id: 1,
                            label: '',
                            data: props.teamData,
                            backgroundColor: "rgb(150, 230, 255)"
                        }
                    ]
                }}
                options={{ 
                        maintainAspectRatio: false, 
                        scales: {
                            y: {
                                min: 0
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text : "Auto-Pickup"
                            }
                        }
                    }}

            />
        </div>
    )

}