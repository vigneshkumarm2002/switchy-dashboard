import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { CategoryScale, TimeScale } from 'chart.js';
import '../App.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

Chart.register(CategoryScale, TimeScale);

const EnergyDistributionGraph = () => {
    const [data, setData] = useState([]);
    const [selectedSources, setSelectedSources] = useState(["load"]);
    const [selectedDate, setSelectedDate] = useState(new Date()); // Initialize with today's date

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    useEffect(() => {
        fetchData(selectedDate);
    }, [selectedDate]); // Fetch data whenever selectedDate changes

    useEffect(() => {
        // Initialize selectedDate with the previous day's date
        const previousDay = new Date();
        previousDay.setDate(previousDay.getDate() - 1);
        setSelectedDate(previousDay);

        fetchData(previousDay);
    }, []);

    const fetchData = async (date) => {
        if (!date) return;

        const startOfDay = new Date(date);
        startOfDay.setHours(5, 30, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);
        endOfDay.setHours(5, 25, 0, 0);

        try {
            const response = await axios.get(
                `https://switchy-source-data.glitch.me/api/mockdata?start=${Math.floor(startOfDay.getTime() / 1000)}&end=${Math.floor(endOfDay.getTime() / 1000)}`
            );
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const chartData = {
        labels: data.map(item => new Date(item.time * 1000).toLocaleTimeString()),
        datasets: [
            {
                label: 'Load',
                data: data.map(item => item.load),
                fill: false,
                borderColor: 'rgb(219, 125, 247)',
                borderWidth: 1, // Adjust line thickness here
                tension: 0.1,
                hidden: !selectedSources.includes('load'),
                pointRadius: 0,
            },
            {
                label: 'Solar',
                data: data.map(item => item.solar),
                fill: false,
                borderColor: '#fa78be',
                borderWidth: 1, // Adjust line thickness here
                tension: 0.1,
                hidden: !selectedSources.includes('solar'),
                pointRadius: 0,
            },
            {
                label: 'Grid',
                data: data.map(item => item.grid),
                fill: false,
                borderColor: '#9BDD7C',
                borderWidth: 1, // Adjust line thickness here
                tension: 0.1,
                hidden: !selectedSources.includes('grid'),
                pointRadius: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true, // Enable responsiveness
        maintainAspectRatio: false,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time',
                    font: {
                        family: "sans serif",
                        weight: 500,
                        size: 14,
                    },
                }, beginAtZero: false,
                grid: {
                    display: false, // Hide vertical gridlines
                },
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10,
                    font: {
                        family: "sans serif",
                        weight: 400,
                        size: 12,
                    },
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Energy Source',
                    font: {
                        family: "sans serif",
                        weight: 500,
                        size: 14,
                    },
                }, beginAtZero: true,
                grid: {
                    display: true,
                },
                ticks: {
                    font: {
                        family: "sans serif",
                        weight: 400,
                        size: 12,
                    }, padding: 10,
                },
                border: {
                    display: false,
                }
            },
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                position: 'nearest',
                callbacks: {
                    title: function (context) {
                        const dataIndex = context[0].dataIndex;
                        const dataItem = data[dataIndex];
                        const date = new Date(dataItem.time * 1000);
    
                        const options = {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        };
    
                        return date.toLocaleDateString('en-US', options);
                    },
                },
            },
            legend: {
                display: false,
            },

        },
        onClick: (_, activeElements) => {
            if (activeElements && activeElements.length > 0) {
                const clickedDatasetIndex = activeElements[0].datasetIndex;
                const clickedDatasetLabel = chartData.datasets[clickedDatasetIndex].label;

                setSelectedSources(prevSelectedSources => {
                    if (prevSelectedSources.includes(clickedDatasetLabel)) {
                        return prevSelectedSources.filter(source => source !== clickedDatasetLabel);
                    } else {
                        return [...prevSelectedSources, clickedDatasetLabel];
                    }
                });
            }
        },
    };

    

    return (
        <div className="barGraph">
            <div className='graphTitle'>
                <h2>Energy Distribution from Various Sources</h2>
                <div className='Inputs'>

                <DatePicker
    selected={selectedDate}
    onChange={handleDateChange}
    wrapperClassName="datePicker"
    placeholderText="Select Date"
    dateFormat="dd MMM yyyy"
    isClearable={false}
    showYearDropdown
    scrollableYearDropdown
    className="custom-datepicker"
/>


                    {['load','solar', 'grid'].map((source) => (
                        <label key={source} className="checkbox-label">
                            <input
                             
                                className={`checkbox-input ${source}`}
                                type="checkbox"
                                checked={selectedSources.includes(source)}
                                onChange={() =>
                                    setSelectedSources(prevSelectedSources =>
                                        prevSelectedSources.includes(source)
                                            ? prevSelectedSources.filter(s => s !== source)
                                            : [...prevSelectedSources, source]
                                    )
                                }
                            />
                            {source}
                        </label>
                    ))}
                </div>
            </div>
            <Line data={chartData} options={chartOptions} />
        </div >
    );
};

export default EnergyDistributionGraph;
