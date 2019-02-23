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
        return body;
        //   return Utility.replaceAll(body, '</video>', '</video><div class="text-right"><a class="text-right mat-button mat-primary open-video">Mở video</a></div>')
    }


    parserArticle(): Article {
        const header = this.html.getElementsByClassName('article__header')[0].textContent;
        const id = this.html.getElementsByClassName('article')[0].getAttribute('data-aid');
        const sourceName = this.html.getElementsByClassName('source')[0].textContent;
        let sourceUrl = this.html.getElementsByClassName('source')[0].getAttribute("href");
        sourceUrl = `https://m.baomoi.com${sourceUrl}`;

        let images = [];
        const imageElements = this.html.getElementsByTagName('img');
        for (let index = 0; index < imageElements.length; index++) {
            images.push(imageElements[index].getAttribute('src'))
        }

        return new Article(id, header, null, this.convertHtmlBody(), null, null, null, sourceUrl, sourceName, images);
    }


}