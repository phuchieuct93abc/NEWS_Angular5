import Article from "../../../../model/Article";
import {ArticleParser} from "../ArticleParser";

export default class BaomoiArticleParser extends ArticleParser {

    constructor(html: Element) {
        super(html);
        const header = html.getElementsByClassName('article__header')[0].textContent;
        const id = html.getElementsByClassName('article')[0].getAttribute('data-aid');
        this._article = new Article(id, header, null, this.convertHtmlBody(), null);
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