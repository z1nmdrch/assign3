const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const port = 3000;
app.set('view engine', 'ejs');

app.use(session({
  secret: 'test',
  resave: true,
  saveUninitialized: true
}));

mongoose.connect("mongodb+srv://zangg:z1ng1r@cluster0.hjieemc.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("connected", () => {
  console.log("the connection was completed successfully");
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
