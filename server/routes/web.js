const express = require('express');
const homepageController = require('../controller/homepageController');
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", (req, res) => res.render('index'));
    return app.use("/", router);
};

module.exports = initWebRoutes;