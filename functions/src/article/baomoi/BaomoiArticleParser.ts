import {ArticleParser} from "../ArticleParser";
import Article from "../../../../model/Article";
import Utility from "../../Utility";

export default class BaomoiArticleParser extends ArticleParser {

    constructor() {
        super();
    }

    private convertHtmlBody() {

        let body = this.html.getElementsByClassName('article__body')[0].innerHTML;
        return Utility.replaceAll(body, "data-", "");
    }


    parserArticle(): Article {
        const header = this.html.getElementsByClassName('article__header')[0].textContent;
        const id = this.html.getElementsByClassName('article')[0].getAttribute('data-aid');
        const sourceName = this.html.getElementsByClassName('source')[0].textContent;
        let sourceUrl = this.html.querySelector(".article__action .plsh").getAttribute("href");
        sourceUrl = `https://m.baomoi.com${sourceUrl}`;

        let images = [];
        const imageElements = this.html.getElementsByTagName('img');
        for (let index = 0; index < imageElements.length; index++) {
            images.push(imageElements[index].getAttribute('src'))
        }
        const description = this.html.getElementsByClassName('article__sapo')[0].textContent;

        let likes = parseInt(this.html.querySelector(".like").textContent);
        let time = this.html.querySelector("time.time").getAttribute('datetime');
        return new Article(id, header, null, this.convertHtmlBody(), null, null, null, sourceUrl, sourceName, images, description,likes,time);
    }


}
