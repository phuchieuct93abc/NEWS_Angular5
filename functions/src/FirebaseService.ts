import * as admin from 'firebase-admin';

import Article from "../../model/Article";
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {firebaseCredentiaL} from "../../model/firebase.config";

const settings = {/* your settings... */ timestampsInSnapshots: true};

let inRunningUnderCloud = process.env.GCP_PROJECT != undefined;

if (inRunningUnderCloud) {
    console.log("running in cloud");
    admin.initializeApp();
} else {
    console.log("Not run in cloud");
    admin.initializeApp({
        credential: admin.credential.cert(firebaseCredentiaL)
    });
}


const db: admin.firestore.Firestore = admin.firestore();
db.settings(settings);

class FirebaseService {

    constructor() {

    }

    getDiffBotCredential(): Promise<string> {
        const diffbot: FirebaseFirestore.CollectionReference = db.collection("diffbot");
        return new Promise(resolver => {
            diffbot.doc('token').get().then(result => {


                resolver(result.data()['value']);
            });
        })
        // c1a9c0acac8593452ca9eccad6ac374c
    }

    saveArticle(article: Article): Promise<FirebaseFirestore.WriteResult> {
        console.time("write" + this.encodeUrl(article.id));
        const articleCollection: FirebaseFirestore.CollectionReference = db.collection("articles");

        let documentFireStore: FirebaseFirestore.DocumentReference = articleCollection.doc(this.encodeUrl(article.id));
        return new Promise(resolver => {
            documentFireStore.set(article.toA()).then(value => {
                console.timeEnd("write" + this.encodeUrl(article.id));
                resolver(value);
            })
        });

    }

    findArticle(id: string): Promise<DocumentSnapshot> {
        console.time("read" + this.encodeUrl(id));

        const articleCollection: FirebaseFirestore.CollectionReference = db.collection("articles");
        return new Promise(resolver => {
            articleCollection.doc(this.encodeUrl(id)).get().then(value => {
                console.timeEnd("read" + this.encodeUrl(id));

                resolver(value)
            });
        })


    }

    private encodeUrl(id): string {
        return id.replace(/\//g, "");

    }
}

export default new FirebaseService();
