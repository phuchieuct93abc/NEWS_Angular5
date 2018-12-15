import Article from "../../model/Article";
import {ArticleParser} from "./parsers/ArticleParser";
import FirebaseService from "./FirebaseService";

export abstract class ArticleService {
    protected parser: ArticleParser;

    abstract crawnArticleById(id: string): Promise<Article>

    public getArticleById(idPath: string): Promise<Article> {

        return new Promise(resolver => {
            FirebaseService.findArticle(idPath).then(article => {
                if (article.exists) {
                    resolver((<Article>article.data()));
                } else {
                    this.crawnArticleById(idPath).then(article => {
                        this.saveArticle(article);
                        resolver(article)
                    })
                }
            })
        })


    }

    protected saveArticle(article: Article) {
        FirebaseService.saveArticle(article);
    }
}