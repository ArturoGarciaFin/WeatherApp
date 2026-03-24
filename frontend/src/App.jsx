import {useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [weatherData, setWeatherData] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/forecast', {
        city: city,
        startDate: startDate,
        endDate: endDate
      });

      setWeatherData(response.data);
      console.log('Data received');
    } catch {
      console.error('Error in search', error);
      alert('Error while searching for forecast. Verify dates and city');
    }
  };

  return (
    <div className="app-container">
      <h1>Weather Forecast</h1>

      <form onSubmit={handleSearch} style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
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
        <div className="results">
          <h2>Forecast for {weatherData.city}</h2>
          <p>Period: {weatherData.period}</p>
          <p><em>(Press F12 / Inspect to see the full data in the Console)</em></p>
        </div>
      )}
    </div>
  );
}

export default App;