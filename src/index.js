// require other files from this project

// require statement for outside libraries
const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Defined paths for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);

// Setup static directory to serve from and middleware functions
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
    res.render('index');
});

// Which port our server should listen to
app.listen(port, () => {
    console.log('Server Started on port 3000.');
});
