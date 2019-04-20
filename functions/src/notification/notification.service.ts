import * as admin from "firebase-admin";
import Article from "../../../model/Article";

export default class NotificationService {
    constructor() {
    }

    topic = "BaoHieu";

    send(article: Article,category:string): Promise<string> {
        let message = {
            data: {
                url: `https://news.phuchieu.cf/${category}/${article.header}/${article.id}`,
                title: "Tin nóng",
                body: article.header
            },
            topic: this.topic
        };
        console.log("send notification", message)
        return admin.messaging().send(message);

    }

    subscribeTopic(token: string, topic: string): Promise<any> {
        return admin.messaging().subscribeToTopic([token], topic)

    }

}
