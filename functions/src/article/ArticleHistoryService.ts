import FirebaseService from '../FirebaseService';
import { verifyGoogleToken } from '../google';

export default class ArticleHistoryService {
  constructor(private googleId: string) {}
  async getReadArticle(): Promise<{ [key: string]: string[] }> {
    const token =
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImJmMWMyNzQzYTJhZmY3YmZmZDBmODRhODY0ZTljMjc4ZjMxYmM2NTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSGlldSBQaHVjIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BRmRadWNvVm9hX1Z6SFFQQ2lxNkVwWmRPUTV6TDctWTFQOE5lUjhjSHpOd0lOZz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9hbmd1bGFyaGVyby0zYjA2NiIsImF1ZCI6ImFuZ3VsYXJoZXJvLTNiMDY2IiwiYXV0aF90aW1lIjoxNjU4NjM2OTcxLCJ1c2VyX2lkIjoiVDFXa0IzaGRRTmJaSWh6Q2xwY0QxY09qQ2dFMiIsInN1YiI6IlQxV2tCM2hkUU5iWkloekNscGNEMWNPakNnRTIiLCJpYXQiOjE2NTg2MzY5NzEsImV4cCI6MTY1ODY0MDU3MSwiZW1haWwiOiJwaHVjaGlldWN0OTNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTQ2NDM5Mjc0MjYxNjQ1NjA2NTMiXSwiZW1haWwiOlsicGh1Y2hpZXVjdDkzQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.NWhpUyYx4zQEtXgQ12-fZK_2oJPoT56Zixv6vJWESRPFVd2ZQ0GfdM096-g9cCfEMWTnd7fDcuRhE3TqMmayyUsmHP0eQiBH1CgA5rvoILFORiBXVbChjqH7vYvpg2qyrIha_iGzosG0AxTi1-1d0hzFuPgnl1jCJQmaOEDTTRrV567s-624um1QlrZORbgJclIWUjL4YBqRMKkBgq5fnTbfzJyVipGclbWlEkaTPa1ec4NKB5hNtV67QsWJFsKheAS2OkL85CLJh6VU9agEEiytNgE5O82n1KXgeoAArKhbgwSsuEL7iJ_GL4spX7klum-y39bsECopG7V5Ky6aTg';
    const email = (await verifyGoogleToken(token)).email;
    console.log(email);
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
    await FirebaseService.getFireStore()
      .collection(`articles-read`)
      .doc(email)
      .set({ ...currentArticleRead, ...{ [categoryId]: [...newReadArticle] } });
  }
}
