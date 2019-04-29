import * as admin from "firebase-admin";
import Article from "../../../model/Article";
import * as url from 'speakingurl';

export default class NotificationService {
    constructor() {
    }

    topic = "BaoHieu";

    send(article: Article, category: string): Promise<string> {
        let message = {
            data: {
                url: `https://news.phuchieu.cf/${category}/${url(article.header)}/${article.id}`,
                title: "Tin nóng",
                body: article.header,
                image:article.images[0]
            },
            topic: this.topic
        };
        console.log(`Send notify `,article)
        return admin.messaging().send(message);

    }

    subscribeTopic(token: string, topic: string): Promise<any> {
        return admin.messaging().subscribeToTopic([token], topic)

    }

}
