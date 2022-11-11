import { useEffect, useState } from 'react';

import "./DataChart.scss"

import { Chart as ChartJS, CategoryScale, LineController, LineElement, ArcElement, PointElement, LinearScale, Title, Tooltip, Legend } from "chart.js"
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LineController, LineElement, ArcElement, PointElement, LinearScale,  Title, Tooltip, Legend)

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

    }, [props.teamData])

    console.log(props.teamData)

    const createChart = (matches, teamData, selectedQuality) => {

        const data = [...teamData]
        console.log(data)

        if (data.includes("FALSE") || data.includes("TRUE")) {

            console.log(data)
            let numFalse = 0;
            let numTrue = 0;

                for (const match of data) {
                    if(match === "FALSE") {
                       numFalse++;
                    } else if(match === "TRUE") {
                        numTrue++;
                    }
                }
            
            return <Pie 
                className='dataChart'
                datasetIdKey='booleanPieChart'
                data={{
                    // Should be match numbers
                    labels: ["Success", "Failed"],
                    datasets: [
                        {
                            id: 1,
                            label: '',
                            data: [numTrue, numFalse],
                            backgroundColor: ["rgb(0, 255, 115)", "rgb(255, 15, 40)"]
                        }
                    ]
                }}
                options={{ 
                        // If there are two values, then have a border radius
                        // Otherwise, complete the entire pie chart
                        borderWidth : data.includes("TRUE") && data.includes("FALSE") ? 2 : 0,
                        maintainAspectRatio: false, 
                        plugins: {
                            title: {
                                display: true,
                                text : selectedQuality
                            }
                        }
                    }}
                    />
        } else {
            return <Line
                className='dataChart'
                datasetIdKey='defaultLineChart'
                data={{
                    // Should be match numbers
                    labels: matches,
                    datasets: [
                        {
                            id: 1,
                            label: '',
                            data: data,
                            backgroundColor: "rgb(150, 230, 255)"
                        }
                    ]
                }}
                options={{ 
                        maintainAspectRatio: false, 
                        scales: {
                            y: {
                                min: 0,
                                ticks: {
                                    stepSize: 1
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text : selectedQuality
                            }
                        }
                    }}

            />
        }

    }

    return (

        <div className='chart'>
            {createChart(props.matches, props.teamData, props.selectedQuality)}
        </div>
    )

}