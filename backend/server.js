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

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta http://localhost:${PORT}`);
});