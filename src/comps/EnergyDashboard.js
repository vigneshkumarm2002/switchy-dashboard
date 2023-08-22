import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import '../App.css';

Chart.register(CategoryScale);

const EnergyConsumptionPerDayGraph = () => {
  const [data, setData] = useState([]);
  const [view, setView] = useState('');
  const [ShowWeek, setShowWeek] = useState(false);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [selectedMonthData, setSelectedMonthData] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(1);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toDateString();
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    updateAvailableMonths();
  }, [data]);

  useEffect(() => {
    if (availableMonths.length > 0) {
      setView(availableMonths[availableMonths.length - 1]);
    }
  }, [availableMonths]);

  useEffect(() => {
    const filteredMonthData = data.filter(item => formatMonth(item.time) === view);
    setSelectedMonthData(filteredMonthData);
    setSelectedWeek(1); // Reset selected week when changing month
  }, [view, data]);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://switchy-fake-data.glitch.me/api/mockdata');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const updateAvailableMonths = () => {
    const uniqueMonths = [...new Set(data.map(item => formatMonth(item.time)))];
    setAvailableMonths(uniqueMonths);
  };

  const toggleView = (newView) => {
    setView(newView);
    setShowWeek(false); // Reset weekly view when changing month
  };

  const formatMonth = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-us', { month: 'long' });
  };

  const displayedData = selectedMonthData.length > 0 ? selectedMonthData : [];

  let weekData = displayedData;
  if (ShowWeek) {
    const startIdx = (selectedWeek - 1) * 7;
    const endIdx = startIdx + 7;
    weekData = displayedData.slice(startIdx, endIdx);
  }

  const chartData = {
    labels: weekData.map((item) => formatTimestamp(item.time)),
    datasets: [
      {
        label: 'Energy Consumption',
        data: weekData.map((item) => item.energy),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const weekOptions = Array.from({ length: Math.ceil(displayedData.length / 7) }, (_, index) => index + 1);

  const handleMonthChange = (event) => {
    toggleView(event.target.value);
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(parseInt(event.target.value, 10));
  };

  const chartOptions = {
    responsive: true, // Enable responsiveness
    maintainAspectRatio: false, 
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
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
          maxRotation:0,
          autoSkip: true,
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
          text: 'Energy Consumption',
          font: {
            family: "sans serif", 
            weight: 500, 
            size: 14, 
          },
        },
        beginAtZero: true,
        grid: {
          display: true,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            family:"sans serif", 
            weight: 400, 
            size: 12, 
          },
          padding: 10,
          
        },
      },
    },
    plugins: {
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="barGraph">
      <div className='graphTitle'>
      <h2>Energy Consumption Per Day</h2>
      <div className='Inputs'>
      <select className='selectInput' value={view} onChange={handleMonthChange}>
        {availableMonths.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>
      <button onClick={() => setShowWeek(!ShowWeek)}>
        {ShowWeek ? 'Show Monthly View' : 'Show Weekly View'}
      </button>
      {ShowWeek && (
       
          <select id="week" className='week' value={selectedWeek} onChange={handleWeekChange}>
            {weekOptions.map((week) => (
              <option key={week} value={week}>
                Week {week}
              </option>
            ))}
          </select>
  
      )}
      </div>
      </div>
      <Bar className='bar' data={chartData} options={chartOptions} />
    </div>
  );
};

export default EnergyConsumptionPerDayGraph;
