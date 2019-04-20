import * as admin from "firebase-admin";
import Article from "../../../model/Article";

export default class NotificationService {
    constructor() {
    }
    topic: "BaoHieu";
    send(article: Article): Promise<string> {
        let message = {
            data: {
                url: "https://google.com",
                title: "Tin nóng",
                body: article.header
            },
            topic: this.topic
        };
        return admin.messaging().send(message);

    }

    subscribeTopic(token: string, topic: string): Promise<any> {
        return admin.messaging().subscribeToTopic([token], topic)

    }

}
