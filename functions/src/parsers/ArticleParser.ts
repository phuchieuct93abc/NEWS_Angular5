import Article from "../../../model/Article";

export abstract class ArticleParser {
    protected html: Element;

    public setHtml(html: any) {
        this.html = html;
        return this;

    }


    abstract parserArticle(): Article;
}