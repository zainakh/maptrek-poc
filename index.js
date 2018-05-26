import twilio from 'twilio';
import dotenv from 'dotenv';
import cron from 'node-cron';

dotenv.config();
const accSID = process.env.ACCOUNT_SID; 
const authToken = process.env.AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

let recepients = [process.env.ZAIN];

const schedulerFactory = function() {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', function() {
        sendNotifications();
    }, null, true, '');
};

function sendNotifications() {
    const client = new twilio(accSID, authToken);
    recepients.forEach(function(recepient) {
        const options ={
            to: `${recepient}`,
            from: twilioNumber,
            body: `MapTrek Reminder`,
        };

        client.messages.create(options, function(err, response) {
            if(err){
                console.error(err);
            } else {
                let masked = recepient.substr(0, recepient.length - 5);
                masked += '*****';
                console.log(`Message sent to ${masked}`);
            }
        });
    });
};

schedulerFactory();