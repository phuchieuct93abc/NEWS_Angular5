import FirebaseService from '../FirebaseService';

export default class ArticleHistoryService {
  async getReadArticle(): Promise<{ [key: string]: { articleId: string[] } }> {
    const articleReadCollection = await FirebaseService.getFireStore().collection(`articles-read`).get();
    const result = articleReadCollection.docs.reduce((acc, doc) => {
      acc[doc.id] = doc.data();
      return acc;
    }, {}) as unknown as { [key: string]: string };
    return result as unknown as { [key: string]: { articleId: string[] } };
  }
  async readArticle(articleId: string, categoryId: string): Promise<void> {
    const currentValue = (await this.getReadArticle())?.[categoryId]?.articleId || [];
    const newReadArticle = new Set([...currentValue, articleId]);
    FirebaseService.getFireStore()
      .collection(`articles-read`)
      .doc(categoryId)
      .set({ articleId: [...newReadArticle] });
  }
}
