import Article from "../../../model/Article";

export default class ArticleParser {
    private article: Article;

    constructor(private html: Element) {
        const header = html.getElementsByClassName('article__header')[0].textContent;
        const id = html.getElementsByClassName('article')[0].getAttribute('data-aid');
        this.article = new Article(id, header, null, this.convertHtmlBody(), null);
    }

    convertHtmlBody() {
        let body = this.html.getElementsByClassName('article__body')[0].innerHTML;
        body = this.replaceAll(body, "data-", "");
        return this.replaceAll(body, "<video", "<video controls")

    }

    getArticle() {
        return this.article;
    }

    replaceAll(str: string, placeholder: string, replacement: string): string {
        return str.replace(new RegExp(placeholder, 'g'), replacement);

    }
}