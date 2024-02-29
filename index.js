const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

//  Services
const { NotFoundException } = require('./exceptions/httpsExceptions');
const errorHandler = require('./middlewares/errorHandler');

//Initialize With Express
const app = express();

//Express Body Parser
app.use(express.json());

//Extendend false to run a simple algorithm for basic parsing
app.use(express.urlencoded({ extended: false }));

//CORS
app.use(cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

//Routes
app.use('/users', require('./routes/users'));
app.use('/admin', require('./routes/admin'));

//Error Handler
app.use((req, res, next) =>
  next(new NotFoundException(null, `404 Not found: ${req.url} does not exist`))
);
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log('Server Started');
});
