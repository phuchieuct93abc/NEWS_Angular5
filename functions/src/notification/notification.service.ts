// Start up the Node server
import * as admin from 'firebase-admin'


export default function notifyHandler(notify) {

    notify.get('/notify', (req, response) => {


        let message = {
            data: {
                score: '850',
                time: '2:45'
            },
            topic: "BaoHieu"
        };

        // Send a message to the device corresponding to the provided
        // registration token.
        setTimeout(() => {
            admin.messaging().send(message)
                .then((res) => {
                    // Response is a message ID string.
                    response.send(res);
                })
                .catch((error) => {
                    response.send(error);
                });
        }, 5000);
    });


    notify.post('/subscribe', (req, response) => {
        let topic = req.body.topic;
        let token = req.body.token;
        console.log(topic, token);
        admin.messaging().subscribeToTopic([token], topic)
            .then((res) => {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                response.send('Successfully subscribed to topic');
                console.log('Successfully subscribed to topic:', res);
            })
            .catch((error) => {
                response.send('Error subscribing to topic:');
                console.log('Error subscribing to topic:', error);
            });

    })


};
