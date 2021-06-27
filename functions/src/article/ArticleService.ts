import Article from "../../../model/Article";
import { ArticleParser } from "./ArticleParser";
import FirebaseService from "../FirebaseService";

export abstract class ArticleService {
    protected category: string
    protected parser: ArticleParser;

    abstract crawnArticleById(id: string): Promise<Article>

    abstract getComment(id: string): Promise<Comment[]>

    public async getArticleById(id: string): Promise<Article> {
        const firebaseArticle = await FirebaseService.findArticle(id);
        if (firebaseArticle?.exists) {
            return firebaseArticle.data() as Article;
        }
        return await this.crawnArticleById(id);
    }

    public async crawnArticleByIdAndSaveArticle(idPath: string): Promise<Article> {
        const firebaseArticle = await FirebaseService.findArticle(idPath);
        if (firebaseArticle?.exists) {
            return null;
        }

        const article = await this.crawnArticleById(idPath);
        await FirebaseService.saveArticle(article);
        return article;
    }

    public abstract getSource(id: string);


}
