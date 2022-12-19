import "./DataChart.scss"

import { Chart as ChartJS, CategoryScale, LineController, LineElement, ArcElement, PointElement, LinearScale, Title, Tooltip, Legend } from "chart.js"
import { Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LineController, LineElement, ArcElement, PointElement, LinearScale,  Title, Tooltip, Legend)

export default function DataChart(props) {


    const createChart = (matches, teamData, selectedQuality) => {

        const data = [...teamData]
        //console.log(data)
        //console.log(typeof data[0])
        
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
                                display: false,
                                text : selectedQuality
                            }
                        }
                    }}
                    />
        } else if (!isNaN(data[0]) ){
        
        let yOption = {};

        if(data.includes("0")){
            yOption = {
                ticks: {
                    stepSize: 1
                }  
                }

            
        } else {
            yOption = {
                min: 0,
                ticks: {
                    stepSize: 1
                }
            }
            
        }

            return <Line
                className='dataChart'
                datasetIdKey='defaultLineChart'
                data={{
                    // Should be match numbers
                    labels: matches.map((matchNum) => "Match #" + matchNum ),
                    datasets: [
                        {
                            id: 1,
                            label: selectedQuality,
                            data: data,
                            backgroundColor: "rgb(15, 230, 255)",
                            borderColor: "rgb(205, 205, 205)",
                            borderWidth: 2,
                            

                        }
                    ]
                }}
                options={{ 
                        maintainAspectRatio: false, 
                        scales: {
                            y:  yOption,
                            x: {
                                title : {
                                    display: true,
                                    text: "Match Number"
                                },
                            },
                            
                        },
                        elements : {
                            point: {
                                borderWidth : 10
                            }
                        },
                        plugins: {
                            title: {
                                display: false,
                                text : selectedQuality
                            }
                        }
                    }}

            />
        } else {
            return data.map((dataPoint) => <p>{dataPoint}</p>)
        }

    }

    

    return (

        <div className='chart'>
            {createChart(props.matches, props.teamData, props.selectedQuality)}
        </div>
    )

}