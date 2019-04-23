import NotificationService from "./notification.service";
import ArticleServiceFactory from "../article/ArticleServiceFactory";


export default function notifyHandler(notify) {

    let notificationService = new NotificationService();
    notify.get('/notify', (req, response) => {

        let articleId = req.query.articleId;
        ArticleServiceFactory.get(req).getArticleById(articleId).then(article => {

            notificationService.send(article,req.query.category).then(result => {
                response.send(result);
            });

        })


    });


    notify.post('/subscribe', (req, response) => {
        let topic = req.body.topic;
        let token = req.body.token;
        notificationService.subscribeTopic(token, topic).then((result) => {
            response.send(result)
        });


    })


};
