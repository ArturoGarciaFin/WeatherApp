import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weatherData, setWeatherData] = useState('');
  const [history, setHistory] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/history');
      setHistory(response.data);
    } 
    
    catch (error) {
      console.error('Error fetching history:', error);
  };

  useEffect(() => {
    fetchHistory();
  }, []);
}

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/forecast', {
        city: city,
        startDate: startDate,
        endDate: endDate
      });

      setWeatherData(response.data);
      fetchHistory();
      console.log('Data received');
    }
    
    catch (error) {
      console.error('Error in search', error);
      alert('Error while searching for forecast. Verify dates and city');
    }
  };


  return (
    <div className="app-container">
      <h1>Weather Forecast</h1>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="City (e.g., Curitiba)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
        <button type="submit">Search Forecast</button>
      </form>

      {weatherData && (
        <div className="results-container">
          <h2>Forecast for {weatherData.period}</h2>
          <p className="period-text">Period: {weatherData.period}</p>

          <div className="forecast-grid">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="weather-card">
                <h3>{day.date}</h3>
                <p className="temp">{Math.round(day.temp)}°C</p>
                <p className="desc">{day.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="history-container">
        <h2>Search History</h2>
        {history.length === 0 ? (
          <p>No history found yet</p>
        ) : (
          <ul className="history-list">
            {history.map((item) => {
              const start = item.start_date ? item.start_date.split('T')[0] : 'N/A';
              const end = item.end_date ? item.end_date.split('T')[0] : 'N/A';

              return (
                <li key={item.id} className="history-item">
                  <div className="history-info">
                    <strong>{item.location}</strong> | {start} to {end} | {item.temperature}°C
                    <span className="history-desc"> ({item.description})</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;