import Article from "../../../model/Article";
import {ArticleParser} from "../parsers/ArticleParser";

export default class BaomoiArticleParser extends ArticleParser {

    constructor() {
        super();
    }
    private convertHtmlBody() {
        let body = this.html.getElementsByClassName('article__body')[0].innerHTML;
        body = this.replaceAll(body, "data-", "");
        return this.replaceAll(body, "<video", "<video controls")

    }

    parserArticle(): Article {
        const header = this.html.getElementsByClassName('article__header')[0].textContent;
        const id = this.html.getElementsByClassName('article')[0].getAttribute('data-aid');
        return new Article(id, header, null, this.convertHtmlBody(), null);
    }

    private replaceAll(str: string, placeholder: string, replacement: string): string {
        return str.replace(new RegExp(placeholder, 'g'), replacement);

    }
}