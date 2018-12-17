import * as admin from 'firebase-admin';
import {ServiceAccount} from 'firebase-admin';
import Article from "../../model/Article";
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import Utility from "./Utility";
import Firestore = admin.firestore.Firestore;

const settings = {/* your settings... */ timestampsInSnapshots: true};

const firebaseConfig: ServiceAccount = {
    "projectId": "angularhero-3b066",
    "privateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDPqV1d03fE3OwD\nuGb/xmBG04tOogLaaq0mLluneRVFBo3s7bYWOUOa5Pm7NLt8hikQEAax+OtdNEye\ng1hVjgqFbh0aV8qQybg4+FgmX87XdLSkWZI9NPOe4hshnZzYP/066J+EZJw5JY3H\nYa1H6osLAwYXg5zQ9yarMcFlOkhTZ3ao6eyNIXlAC9t8ztXbRTqlqn34ywkyGlCi\nIK0H7oMAfBVKpidkeWyFUS7RczYJWI1QDb0O7QNEPJ4FhFkkEduUwfrPxPcE3rMi\nync2CRwOhXUilcHlwqcsKYeuA+H8nQlmbGggn6wdXQN0ISauoqf0iZKUiyI51scm\ndTAou0BpAgMBAAECggEAYJwJKWD72/TxwktUc9M9MEYzjboWvLmbY2N21YOh7xJ9\nDciLiWxLtPCo9Dy0qtqZmPTzwHGvQhXWPXqaqnbiEzBmzr4gKdsG304+aF/zUU5k\nyf8350zOuFC10Z5LfVnLvE/EAqpx+a4sdyFMpeQKmu1ltKPQ3XDWJxgHQspqIo5t\nW0qdB85fGnVMYFIB43eFcq+qwuWGsSLiVHv9GFJjt0ounSlqHbSyWm3eGrWKz5qv\n+PXXH+2c4gUZhzX3skVOma1I3X1jUoQFw1KONssUIAlQ/D7kzVZkacudVLZDoUkn\nbmRgKXj2UqDswTr27JKCZTBd8zvZ9Ngc5PivlpawXwKBgQD3IAD5AD3sQ5Jev4+e\n2MGQDs6O7S8nmKhDMimV6vA+bSHtXz/X4/iKMfD2JJO0SHDdgJuvwxTgckjlPneK\nvKJuZSLAYHfH4EDWW33VLAsYbcQoTHfS/MFJWG7YIIJGeDKgtWMXqlihFy5Zg29A\nwJNK4QDnAsAmql9mvVxcKuJ9DwKBgQDXHouj5R9gF6vNvetsAwtGuLh2wkoq2hJK\n52EeVwMUIrmAVZAJujiu+yZIPuJS2sYuOFeslLKARBicVRUaRXSMona7fhTEPeHs\nyZSaEWdcBPYr8osxv0t/9OLZOrrwYOngRZCf/Tn+IGofmdZTCSfRc7dCoZvra8gE\nZgtTh5LbBwKBgQC9194na2ImoHpPQ0Xnt4hrTJSuA9OXzZRlmqGLw+IvctL/cY6w\nITeLonYEAXFeq8/YubXgPjNJgUIyqdxXvjXiLNuXggRCjioBAmQWYTFc4OYyNxxN\n/1HVMJRmgALUc/4gq3emdHyFtDMtHOVYjxgYC+YPkXNfwL5tRMcxHtjDTQKBgEmm\nlZyph5J4yEOKsJ2sdSHjgJR4dLgzLWwjx+aBV/Z+5RABO215KosORc8aaJaBfLS6\naZoW1v5/UgXEQ5NZEExOG2SaCDYgEcfmRFBzgPXKZRYq1mlT21+V0k0ZhINkSu6U\nIq4EHuTY6DyliPGpAs79VVMkzaNOpY6L+XjBxA/lAoGAYIKw/o9Di0KCYzHjzqGq\n6whveQfIBT+Eqg2BSrl1v4AAMBbfkmTXeke9rTJxhATHEx12vJX7g7Td73fwKccH\nh1bTPT2NY87+Z6/IAUYGWcQU45oz5/+F4U100CCYudvsfQKMWFlnM8VfIoczjsgw\n00SDncId1V2MSP3o4XoKeak=\n-----END PRIVATE KEY-----\n",
    "clientEmail": "angularhero-3b066@appspot.gserviceaccount.com",
};
const functions = require('firebase-functions');


class FirebaseService {
    db: Firestore;
    articleCollection: any;

    constructor() {
        if (functions.config().firebase) {

            admin.initializeApp(functions.config().firebase);
        } else {

            admin.initializeApp({
                credential: admin.credential.cert(firebaseConfig)
            });

        }
        this.db = admin.firestore();
        this.db.settings(settings);
        this.articleCollection = this.db.collection("articles");
    }

    saveArticle(article: Article) {
        this.articleCollection.doc(article.id).set(article.toJSON());
    }

    findArticle(id: string): Promise<DocumentSnapshot> {

        return this.articleCollection.doc(Utility.extractId(id)).get();
    }
}

export default new FirebaseService();