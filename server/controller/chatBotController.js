const dotenv = require('dotenv');
//const { request } = require('http');
const request = require('request');


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


           //check if the event is a message or postback and
           //pass the event to the appropriate handler function
           if(webhook_event.message){
            console.log("********");
            console.log("sender psid="+sender_psid, "message="+webhook_event.message);
            handleMessage(sender_psid, webhook_event.message);
           }
           else if(webhook_event.postback){
            handlePostback(sender_psid, webhook_event.postback);
           }
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



//handles messages events
function handleMessage(sender_psid, received_message){
    let response;

    //check if the message contains text
    if(received_message.text){
        console.log("received message ="+received_message.text);

        //create the payload for a basic text message
        response = {
            "text": `you sent the message: "${received_message.text}" .Now send me an image!`
        }
    }

    //send the response message
    callSendAPI(sender_psid, response);
}

//handles messaging_postbacks events
function handlePostback(sender_psid, received_postback){

}

//send response messages via the send API
function callSendAPI(sender_psid, response){
    // construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    };

    
    //send the http request to the messenger platform
    request({
        "uri": "https://graph.facebook.com/v6.0/me/messages",
        "qs": { "access_token": process.env.FB_PAGE_TOKEN},
        "method": "POST",
        "json": request_body 
    }, (err,res,body) => {
        if(!err){
            console.log('message sent!');
            console.log(`My message: ${response}`);
        }else{
            console.error("Unable to send message:" + err);
        }
    });
}


module.exports = {
    postWebhook: postWebhook,
    getWebhook: getWebhook
}; 