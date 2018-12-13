import Article from "../../../model/Article";

export abstract class ArticleParser {
    protected html: Element;

    protected constructor(html: Element) {
        this.html = html;
    }

    protected _article: Article;

    get article(): Article {
        return this._article;
    }
}