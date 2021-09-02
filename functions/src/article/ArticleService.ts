import Article from "../../../model/Article";
import { ArticleParser } from "./ArticleParser";
import FirebaseService from "../FirebaseService";

export abstract class ArticleService {
    protected category: string
    protected parser: ArticleParser;

     abstract crawnArticleById(id: string): Promise<Article>

    abstract getComment(id: string): Promise<Comment[]>

    public async getArticleById(id: string): Promise<Article> {
        const firebaseArticle = await FirebaseService.findArticle(id, this.category);
        if (firebaseArticle?.exists) {
            return firebaseArticle.data() as Article;
        }
        return this.crawnArticleById(id);
    }

    public async crawnArticleByIdAndSaveArticle(articleId: string): Promise<Article> {
        const firebaseArticle = await FirebaseService.findArticle(articleId, this.category);
        if (firebaseArticle?.exists) {
            return null;
        }

        const article = await this.crawnArticleById(articleId);
        await FirebaseService.saveArticle(article, this.category);
        return article;
    }


}
