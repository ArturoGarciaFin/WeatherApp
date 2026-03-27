# Full-Stack Weather Forecast Application

This is a full-stack weather forecast application built for a technical assessment. It allows users to search for a 5-day weather forecast within a specific date range, saves the search history to a MySQL database, and provides full CRUD (Create, Read, Update, Delete) capabilities over the saved records.

## 🚀 Features

- **Forecast Search:** Fetch real weather data using the OpenWeather API.
- **Date Range Validation:** Users can specify a start and end date. The backend validates the range and filters the API response accordingly.
- **Search History (CRUD):**
  - **Create:** Automatically saves valid searches (location, calculated average temperature, and dates) to the database.
  - **Read:** Displays the history of all previous searches on the frontend.
  - **Update:** Users can rename the location of a past search directly from the UI.
  - **Delete:** Users can remove a specific search record from their history.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Axios, CSS.
- **Backend:** Node.js, Express, Axios, MySQL2, dotenv, cors.
- **Database:** MySQL.
- **External API:** OpenWeather API.

## ⚙️ Prerequisites

Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

## 📦 Installation & Setup

### 1. Database Setup
Open your MySQL client (e.g., MySQL Workbench) and run the following script to create the database and the necessary table:

```sql
CREATE DATABASE weather_db;
USE weather_db;

CREATE TABLE weather_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location VARCHAR(255) NOT NULL,
    temperature FLOAT,
    description VARCHAR(255),
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_date DATE,
    end_date DATE
);
```

### 2. Backend Setup
Open a terminal, navigate to the `backend` folder, and install the dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` root folder and add your credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=weather_db
OPENWEATHER_API_KEY=your_openweather_api_key
```

Start the backend server:
```bash
node server.js
```
*The backend will run on `http://localhost:5000`.*

### 3. Frontend Setup
Open a **new** terminal, navigate to the `frontend` folder, and install the dependencies:
```bash
cd frontend
npm install
```

Start the React development server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:5173`.*

## 💡 How to Use
1. Access the application via your browser at `http://localhost:5173`.
2. Enter a city name and select a start and end date.
3. Click "Search Forecast" to view the results.
4. Scroll down to manage your search history (Edit or Delete records).