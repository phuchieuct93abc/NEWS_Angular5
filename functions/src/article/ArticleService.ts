import Article from "../../../model/Article";
import {ArticleParser} from "./ArticleParser";
import FirebaseService from "../FirebaseService";

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
                        resolver(article)
                    })
                }
            })
        })


    }

    public crawnArticleByIdAndSaveArticle(idPath: string): Promise<Article> {
        return new Promise((resolver) => {

            FirebaseService.findArticle(idPath).then(article => {

                if (article.exists) {
                    resolver(null);
                } else {
                    this.crawnArticleById(idPath).then(article => {
                        this.saveArticle(article).then(value => {
                            console.log(`success store article ${article.header}`);
                            resolver(article)
                        });
                    })
                }
            })


        })


    }

    protected saveArticle(article: Article): Promise<FirebaseFirestore.WriteResult> {
        return FirebaseService.saveArticle(article);
    }
}