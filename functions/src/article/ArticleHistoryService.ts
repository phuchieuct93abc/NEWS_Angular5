import FirebaseService from '../FirebaseService';
import { verifyGoogleToken } from '../google';

export default class ArticleHistoryService {
  constructor(private googleId: string) {}
  async getReadArticle(): Promise<{ [key: string]: string[] }> {
    const email = (await verifyGoogleToken(this.googleId)).email;
    const articleReadCollection = await FirebaseService.getFireStore().collection(`articles-read`).doc(email).get();
    if (articleReadCollection.exists) {
      return articleReadCollection.data() as unknown as { [key: string]: string[] };
    }
    return {};
  }
  async readArticle(articleId: string, categoryId: string): Promise<void> {
    const email = (await verifyGoogleToken(this.googleId)).email;
    const currentArticleRead = await this.getReadArticle();
    const currentArticleReadByCategory = currentArticleRead?.[categoryId] || [];
    const newReadArticle = new Set([...currentArticleReadByCategory, articleId]);
    console.log({ ...currentArticleRead, ...{ [categoryId]: newReadArticle } });
    await FirebaseService.getFireStore()
      .collection(`articles-read`)
      .doc(email)
      .set({ ...currentArticleRead, ...{ [categoryId]: [...newReadArticle] } });
  }
}
