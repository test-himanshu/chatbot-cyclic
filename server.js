const express = require('express');
const initWebRoutes = require('./server/routes/web');
const viewEngine = require('./views/viewEngine');
const bodyparser = require('body-parser');
const bodyParser = require('body-parser');




let app = express();

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