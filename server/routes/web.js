const express = require('express');
const chatBotController = require('../controller/chatBotController');
const getHomepage = require('../controller/homepageController');
let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", getHomepage);
    router.get("/webhook", chatBotController.getWebhook);
    router.post("/webhook", chatBotController.postWebhook);


    return app.use("/", router);
};

module.exports = initWebRoutes;