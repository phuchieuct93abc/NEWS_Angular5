import Article from "../../../../model/Article";
import {ArticleParser} from "../ArticleParser";


export default class GoogleArticleParser extends ArticleParser {
    constructor() {
        super();
    }

    parserArticle(): Article {
        return null;
    }
}
