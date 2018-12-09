import Article from "../../../model/Article";

export default class ArticleParser {
    private article: Article;

    constructor(html: Element) {
        console.log(html.innerHTML)
        const header = html.getElementsByClassName('article__header')[0].textContent;
        const body = html.getElementsByClassName('article__body')[0].innerHTML;
        const id = html.getElementsByClassName('article')[0].getAttribute('data-aid');
        this.article = new Article(id, header, null, body, null);
    }
    getArticle(){
        return this.article;
    }
}