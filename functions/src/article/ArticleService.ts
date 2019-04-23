import Article from "../../../model/Article";
import {ArticleParser} from "./ArticleParser";
import FirebaseService from "../FirebaseService";

export abstract class ArticleService {
    protected parser: ArticleParser;

    abstract crawnArticleById(id: string): Promise<Article>

    abstract getComment(id: string): Promise<Comment[]>

    public getArticleById(id: string): Promise<Article> {
        return new Promise(resolver => {
            FirebaseService.findArticle(id).then(article => {
                if (article && article.exists) {
                    console.error(`get from firebase ${id}`)
                    resolver((<Article>article.data()));
                } else {
                    this.crawnArticleById(id).then(article => {
                        console.error(`get from baomoi ${id}`)
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
                    console.log("reject roi", idPath)

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

    public abstract getSource(id: string);

    protected saveArticle(article: Article): Promise<FirebaseFirestore.WriteResult> {
        return FirebaseService.saveArticle(article);
    }
}
