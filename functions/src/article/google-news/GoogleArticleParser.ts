import Article from "../../../../model/Article";
import {ArticleParser} from "../ArticleParser";


export default class GoogleArticleParser extends ArticleParser {
    constructor() {
        super();
    }

    parserArticle(): Article {
        return null;
    }

    private convertHtmlBody() {
        let body = this.html.getElementsByClassName('article__body')[0].innerHTML;
        body = this.replaceAll(body, "data-", "");
        return this.replaceAll(body, "<video", "<video controls")

    }

    private replaceAll(str: string, placeholder: string, replacement: string): string {
        return str.replace(new RegExp(placeholder, 'g'), replacement);

    }
}