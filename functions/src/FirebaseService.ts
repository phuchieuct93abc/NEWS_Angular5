import * as admin from 'firebase-admin';

import Article from "../../model/Article";
import {DocumentSnapshot} from "firebase-functions/lib/providers/firestore";
import {firebaseCredentiaL} from "../../model/firebase.config";

const settings = {/* your settings... */ timestampsInSnapshots: true};

let inRunningUnderCloud = process.env.GCP_PROJECT != undefined;

if (inRunningUnderCloud) {
    admin.initializeApp();
} else {
    admin.initializeApp({
        credential: admin.credential.cert(firebaseCredentiaL)
    });
}


const db: admin.firestore.Firestore = admin.firestore();
db.settings(settings);

class FirebaseService {

    getDiffBotCredential(): Promise<string> {
        const diffbot: FirebaseFirestore.CollectionReference = db.collection("diffbot");
        return new Promise(resolver => {
            diffbot.doc('token').get().then(result => {


                resolver(result.data()['value']);
            });
        })
        // c1a9c0acac8593452ca9eccad6ac374c
    }

    async saveArticle(article: Article, category: string): Promise<FirebaseFirestore.WriteResult> {
        const articleCollection: FirebaseFirestore.CollectionReference = db.collection(`articles-${category}`);

        let documentFireStore: FirebaseFirestore.DocumentReference = articleCollection.doc(article.id);
        return documentFireStore.set(article.getJSON())
    }

    async findArticle(id: string, category: string): Promise<DocumentSnapshot> {

        const articleCollection: FirebaseFirestore.CollectionReference = db.collection(`articles-${category}`);
        return articleCollection.doc(id).get();
    }
}

export default new FirebaseService();
