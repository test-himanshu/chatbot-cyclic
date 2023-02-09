const express = require('express');
const initWebRoutes = require('./server/routes/web');
const viewEngine = require('./views/viewEngine');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({path: 'config.env'});
const connectDB = require('./server/database/connection')

let app = express();

connectDB();


//config view engine
viewEngine(app);

//use body parser to post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//init all web routes
initWebRoutes(app);

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`App is running at the port ${port}`);
});