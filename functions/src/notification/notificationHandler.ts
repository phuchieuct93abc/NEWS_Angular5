import NotificationService from "./notification.service";
import ArticleServiceFactory from "../article/ArticleServiceFactory";


export default async function notifyHandler(notify) {

    let notificationService = new NotificationService();
    notify.get('/notify', async (req, response) => {
        let articleId = req.query.articleId;
        const article = await ArticleServiceFactory.get(req.query.category).getArticleById(articleId);
        const result = await notificationService.send(article, req.query.category);
        response.send(result);
    });

    notify.post('/subscribe', async (req, response) => {
        let topic = req.body.topic;
        let token = req.body.token;
        const result = await notificationService.subscribeTopic(token, topic);
        response.send(result)
    })

};
