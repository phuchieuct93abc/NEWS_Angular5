import * as admin from 'firebase-admin';
import { DocumentSnapshot } from 'firebase-functions/v1/firestore';

import Article from 'model/Article';
import { firebaseCredentiaL } from '@model/firebase.config';

const settings = { /* your settings... */ timestampsInSnapshots: true };

let inRunningUnderCloud = process.env.GCP_PROJECT != undefined;

if (inRunningUnderCloud) {
  admin.initializeApp();
} else {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseCredentiaL),
  });
}

const db: admin.firestore.Firestore = admin.firestore();
db.settings(settings);

class FirebaseService {
  public getFireStore(): admin.firestore.Firestore {
    return db;
  }

  async saveArticle(article: Article, category: string): Promise<FirebaseFirestore.WriteResult> {
    const articleCollection: FirebaseFirestore.CollectionReference = db.collection(`articles-${category}`);
    let documentFireStore: FirebaseFirestore.DocumentReference = articleCollection.doc(article.id);
    return documentFireStore.set(article.getJSON());
  }

  async findArticle(id: string, category: string): Promise<DocumentSnapshot> {
    const articleCollection: FirebaseFirestore.CollectionReference = db.collection(`articles-${category}`);
    return articleCollection.doc(id).get();
  }

  async getDiffBotCredential(): Promise<string> {
    const token = await db.collection('diffbot').doc('token').get();
    return token.data().value;
  }
}

export default new FirebaseService();
