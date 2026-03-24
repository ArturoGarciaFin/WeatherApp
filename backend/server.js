const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL', err);
        return;
    }

    console.log('Conected to MySQL');
});

const PORT = 5000;

app.get('/api/weather', async (req, res) => {
    try {
        const city = req.query.city;
        if (!city) {
            return res.status(400).json({error: 'Please, inform a city'});
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`;
        const response = await axios.get(url);

        const weatherData = {
            location: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon
        };

        const sql = 'INSERT INTO weather_history (location, temperature, description) VALUES (?, ?, ?)';
        const values = [weatherData.location, weatherData.temperature, weatherData.description];

        db.query(sql, values, (err, res) => {
            if (err) {
                console.error('Error saving in database', err);
            } else {
                console.log('Search saved sucessfully. ID:', res.insertId);
            }
        });

        res.json(weatherData);

        res.json({
            location: response.data.name,
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon
        });
    }

    catch (error) {
        console.error('Error while searching for climate:', error.message);
        res.status(500).json({error: 'Error while searching for climate data. Please verify that city exists.'});
    }
});

app.post('/api/forecast', async (req, res) => {
    try {
        const {city, startDate, endDate} = req.body;

        if (!city || !startDate || !endDate) {
            return res.status(400).json({error: 'City, start date and end date are mandatory.'});
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            return res.status(400).json({error: 'End date cannot be before start date.'});
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
        const response = await axios.get(url);

        const filteredForecast = response.data.list.filter(item => {
            const itemDate = new Date(item.dt_txt.split(' ')[0]);
            const isMidday = item.dt_txt.includes('12:00:00');

            return itemDate >= start && itemDate <= end && isMidday;
        });

        if (filteredForecast.length === 0) {
            return res.status(404).json({error: 'No forecast found in this interval (limit is 5 days).'});
        }

        const resultData = filteredForecast.map(day => ({
            date: day.dt_txt.split(' ')[0],
            temp: day.main.temp,
            description: day.weather[0].description
        }));

        const avgTemp = (resultData.reduce((sum, day) => sum + day.temp, 0) / resultData.length).toFixed(1);
        const mainDesc = resultData.description;
        const sql = 'INSERT INTO weather_history (location, temperature, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)';
        const values = [city, avgTemp, mainDesc, startDate, endDate];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error('Error in database CREATE', err);
            } else {
                console.log(`Forecast saved. ID: ${result.insertID} | Time: ${startDate} to ${endDate}`);
            }
        });

        res.json({
            city: response.data.city.name,
            period: `${startDate} to ${endDate}`,
            forecast: resultData
        });
    }

    catch (error) {
        console.error('Error in forecast route', error.message);
        res.status(500).json({error: 'Error while searching for forecast. Verify city name'});
    }
});

app.get('/api/history', (req, res) => {
    const sql = 'SELECT * FROM weather_history ORDER BY id DESC';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error searching for history in database', err);
            return res.status(500).json({error: 'Error loading search history'});
        }

        res.json(result);
    })
});

app.put('/api/history/:id', (req, res) => {
    const {id} = req.params;
    const {location} = req.body;
    if (!location || location.trim().length < 2) {
        return res.status(400).json({error: 'Please give a valid location number with at least 2 characters'});
    }

    const sql = 'UPDATE weather_history SET location = ? WHERE id = ?';

    db.query(sql, [location, id], (err, result) => {
        if (err) {
            console.error('Error updating database', err);
            return res.status(500).json({error: 'Error while updating registry'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'No registry found with this ID'});
        }

        res.json({
            message: 'Registry updated sucessfully',
            id: id,
            newLocation: location
        });
    });
});

app.delete('/api/history/:id', (req, res) => {
    const {id} = req.params;
    const sql = 'DELETE FROM weather_history WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting from database', err);
            return res.status(500).json({error: 'Error deleting registry'});
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({error: 'No registry found with this ID'});
        }

        res.json({message: 'Registry deleted sucessfully', id: id});
    });
});

app.listen(PORT, () => {
    console.log(`Server running in port http://localhost:${PORT}`);
});