import Article from "../../model/Article";
import {ArticleParser} from "./parsers/ArticleParser";

export abstract class ArticleService {
    protected parser: ArticleParser;

    abstract getArticleById(id: string): Promise<Article>


}