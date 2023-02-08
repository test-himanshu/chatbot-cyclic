const dotenv = require('dotenv');

dotenv.config({path: 'config.env'});

let postWebhook = (req, res) => {
    let body = req.body;

    //Checks this is an event from a page subscription
    if(body.object === 'page'){
        //iterates over each entry - there may be multiple if bathced
        body.entry.forEach(function(entry){
           //gets the body of the webhook event
           let webhook_event = entry.messaging[0];
           console.log(webhook_event);

           //get the sonder PSID
           let sender_psid = webhook_event.sender.id;
           console.log('Sender PSID: ' + sender_psid);

           
        });

        //return a 200-OK response to all requests
        res.status(200).send('EVENT_RECEIVED');
    } else{
        //return a 404-not found if event is not from a page subscription
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) => {
    //your verif token. Should be a random string.
    let VERIFY_TOKEN = process.env.MY_VERIFY_FB_TOKEN

    //parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    //checks if a token and mode is in query string of the request
    if(mode && token){

        //checks the mode and token sent is correct
        if(mode === 'subscribe' && token === VERIFY_TOKEN){

            //responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else{
            //responds with 403-forbidden if verify tokens do not match
            res.sendStatus(403);
        }
    }
};


module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook
}; 