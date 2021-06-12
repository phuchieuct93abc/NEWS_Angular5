import Article from "../../../model/Article";
import {ArticleParser} from "./ArticleParser";
import FirebaseService from "../FirebaseService";

export abstract class ArticleService {
    protected category: string
    protected parser: ArticleParser;

    abstract crawnArticleById(id: string): Promise<Article>

    abstract getComment(id: string): Promise<Comment[]>

    public getArticleById(id: string): Promise<Article> {
        return new Promise(resolver => {
            FirebaseService.findArticle(id).then(article => {
                if (article && article.exists) {
                    resolver((<Article>article.data()));
                } else {
                    this.crawnArticleById(id).then(article => {
                        resolver(article)
                    })
                }
            })
        })
    }

    public crawnArticleByIdAndSaveArticle(idPath: string): Promise<Article> {
        return new Promise((resolver, reject) => {

            FirebaseService.findArticle(idPath).then(article => {
                if (article && article.exists) {
                    resolver(null);
                } else {
                    this.crawnArticleById(idPath).then(article => {
                        this.saveArticle(article).then(value => {
                            resolver(article)
                        });
                    })
                }
            })


        })


    }

    public abstract getSource(id: string);

    protected saveArticle(article: Article): Promise<FirebaseFirestore.WriteResult> {
        return FirebaseService.saveArticle(article);
    }
}
