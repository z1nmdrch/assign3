# Weather, Breed, and Book Information App

This project is a web application that allows users to register, login, and access various features related to weather, breed information, and books. Users can register with a username, email, and password. Registered users can log in to access personalized features.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Admin information](#admin)
- [APIs](#api)
- [Routes](#routes)
- [Technologies Used](#technologies-used)


## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/z1nmdrch/as3.git

2. Navigate to the project directory:

    ```bash
    cd as3
    
3.Install dependencies:

    ```bash
    npm install
    
4. Start the server:
    ```bash
    nodemon app.js

## Usage

After installing the application, users can register and log in to access personalized features. They can get weather information for a specific city, find breed information about cats, and search for books.


## Admin information:

- username: Zangar
- email: Zangar@gmail.com
- password: Zangar

## APIs

- OpenWeatherMap API: Used to fetch weather data for a specific city. `http://api.openweathermap.org/data/2.5/weather`
- TheCatAPI: Used to fetch information about cat breeds. `https://api.thecatapi.com/v1/breeds/search`
- Open Library API: Used to search for books based on a query string. `https://openlibrary.org/search.json`

## Routes

- /login: Login page.
- /: Registration page.
- /admin/:userId: Admin page for managing users (accessible only to administrators).
- /admin/add/:userId: Add new user (accessible only to administrators).
- /admin/update/:userId: Update user information (accessible only to administrators).
- /admin/delete/:deleteUserId/:userId: Delete user (accessible only to administrators).
- /weather/:userId: Get weather information for a city.
- /breed/:userId: Get breed information for a cat.
- /books/:userId: Search for books.
- /history/:userId: View user's history of weather, breed, and book searches.

## Technologies Used
Node.js
Express.js
MongoDB
Mongoose
EJS (Embedded JavaScript)
Axios