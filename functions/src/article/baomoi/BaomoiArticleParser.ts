import {ArticleParser} from "../ArticleParser";
import Article from "../../../../model/Article";
import Utility from "../../Utility";

export default class BaomoiArticleParser extends ArticleParser {

    constructor() {
        super();
    }

    private convertHtmlBody() {

        let body = this.html.getElementsByClassName('article__body')[0].innerHTML;
        body = Utility.replaceAll(body, "data-", "");
        body = Utility.replaceAll(body, "<video", "<video controls");
        return Utility.replaceAll(body, '</video>', '</video><div class="text-right"><a class="text-right mat-button mat-primary open-video">Mở video</a></div>')
    }

    parserArticle(): Article {
        const header = this.html.getElementsByClassName('article__header')[0].textContent;
        const id = this.html.getElementsByClassName('article')[0].getAttribute('data-aid');
        return new Article(id, header, null, this.convertHtmlBody(), null);
    }


}