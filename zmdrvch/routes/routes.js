const express = require('express');
const router = express.Router();
const axios = require('axios');

const User = require('../models/User');
const Weather = require('../models/weather')
const Breed = require('../models/Breed');
const Book = require('../models/Book');
router.get('/', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res)=>{
    res.render('login');
})

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.render("register.ejs", { errorMessage: "Username already exists" });
            return;
        }
        let isAdmin = false;
        if (username === "Zangar" && password === "Zangar" && email === "Zangar@gmail.com") {
            isAdmin = true;
        }
        const newUser = new User({ username, email,  password, isAdmin });
        await newUser.save();
        req.session.userId = newUser._id;
        res.redirect(`/weather/${newUser._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.userId = user._id;
            res.redirect(`/weather/${user._id}`);
        } else {
            res.send('Invalid username or password.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/weather/:userId', async( req, res)=>{
    try {
        res.render("weather", {
            userId: req.params.userId,
            weatherData: null
        }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data");
    }
})

router.post('/weather/:userId', async (req, res) => {
    try {
        const apiKey = '16d311977fced07064aa910221a6b04c';
        const city = req.body.city;
        const userId = req.params.userId; 
        if (!city) {
            return res.status(400).json({ error: 'Не указан город в запросе' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const { weatherData, newWeatherData } = await fetchAndSaveWeatherData(city, userId, apiKey);

        res.render("weather", {
            userId: req.params.userId,
            weatherData: newWeatherData,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching weather data");
    }
});

async function fetchAndSaveWeatherData(city, userId, apiKey) {
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await axios.get(apiUrl);
    const weatherData = response.data;
    
    const retrievalTime = new Date();
    const temperature = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const weatherIcon = weatherData.weather[0].icon;
    const description = weatherData.weather[0].description;
    const coordinates = `(${weatherData.coord.lat}, ${weatherData.coord.lon})`;
    const humidity = weatherData.main.humidity;
    const pressure = weatherData.main.pressure;
    const windSpeed = weatherData.wind.speed;
    const countryCode = weatherData.sys.country;
    const rainVolume = weatherData.rain ? weatherData.rain["1h"] : "N/A";
    const cityName = weatherData.name;
    const country = weatherData.sys.country;

    const newWeatherData = await Weather.create({
        user: userId,
        city: cityName,
        temperature,
        feelsLike,
        retrievalTime,
        weatherIcon,
        description,
        coordinates,
        humidity,
        pressure,
        windSpeed,
        countryCode,
        rainVolume,
        country,
    });

    return { weatherData, newWeatherData };
}

router.get('/breed/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        res.render('breed', { userId: userId, breedInfo: null }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error rendering nutrition page");
    }
});


router.post('/breed/:userId', async (req, res) => {
    const userId = req.params.userId;
    const breed = req.body.breed;
    const apiUrl = `https://api.thecatapi.com/v1/breeds/search?q=${breed}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.length === 0) {
            res.render('breed', { userId: userId, breedInfo: null });
        } else {
            const breedInfo = {
                name: data[0].name,
                origin: data[0].origin,
                description: data[0].description
            };

            const newBreed = new Breed({
                user: userId,
                input: breed,
                name: breedInfo.name,
                origin: breedInfo.origin,
                description: breedInfo.description
            });
            await newBreed.save();

            res.render('breed', { userId: userId, breedInfo });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.render('breed', { userId: userId, breedInfo: null });
    }
});

router.get('/books/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        res.render('books', { userId: userId, books: null }); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Error rendering nutrition page");
    }
});


router.post('/books/:userId', async (req, res) => {
    const userId = req.params.userId;
    const bookTitle = req.body.book;

    try {
        const apiUrl = `https://openlibrary.org/search.json?q=${bookTitle}&limit=5`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.docs.length === 0) {
            res.render('books', { userId: userId, books: [] }); 
        } else {
            const booksData = data.docs.map(book => ({
                title: book.title,
                author: book.author_name ? book.author_name[0] : 'Unknown',
                publishDate: book.publish_date ? book.publish_date[0] : 'Unknown'
            }));
            const newBook = new Book({
                user: userId,
                books: booksData
            });
            await newBook.save();

            res.render('books', { userId: userId, books: booksData });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send("Error rendering books page");
    }
});



router.get('/history/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const weatherHistory = await Weather.find({ user: userId });
      const breedHistory = await Breed.find({ user: userId });
      const bookHistory = await Book.find({ user: userId });
      const history = {
        weatherHistory,
        breedHistory,
        bookHistory
      };
      const user = await User.findById(userId);
    //   res.json(history)
      res.render('history', { userId: userId, user: user,  history: history });
    } catch (error) {
      console.error('Error getting history:', error);
      res.status(500).send('Internal Server Error');
    }
});

const isAdminMiddleware = async (req, res, next) => {
    const userId = req.params.userId;
    try {
        const user = await User.findById(userId);
        if (user && user.isAdmin) {
            next();
        } else {
            res.status(403).send('Access forbidden. Only administrators can access this page.');
        }
    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).send('Internal Server Error');
    }
};

router.get('/admin/:userId', isAdminMiddleware, async (req, res) => {
    try {
        const userId = req.params.userId;
        const users = await User.find();
        res.render('admin', { userId: userId, users: users });
    } catch (error) {
        console.error('Error rendering admin page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/admin/add/:userId', isAdminMiddleware, async (req, res) => {
    const adminId = req.params.userId;
    const { username, email, password, isAdmin } = req.body; // Добавлено поле email
    try {
        const adminUser = await User.findById(adminId);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).send('Forbidden');
        }
        const newUser = new User({ username, email, password, isAdmin });
        await newUser.save();
        res.redirect(`/admin/${adminId}`);
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/admin/update/:userId', isAdminMiddleware, async (req, res) => {
    const adminUserId = req.params.userId;
    const { updateUserId, username, email, password, isAdmin } = req.body; // Добавлено поле email

    try {
        const updatedUser = await User.findByIdAndUpdate(updateUserId, {
            username: username,
            email: email,
            password: password,
            isAdmin: isAdmin
        }, { new: true });

        res.redirect('/admin/' + adminUserId);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/admin/delete/:deleteUserId/:userId', isAdminMiddleware, async (req, res) => {
    const adminId = req.params.userId;
    const userId = req.params.deleteUserId;
    try {
        const adminUser = await User.findById(adminId);
        if (!adminUser || !adminUser.isAdmin) {
            return res.status(403).send('Forbidden');
        }
        await User.findByIdAndDelete(userId);
        res.redirect(`/admin/${adminId}`);
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;