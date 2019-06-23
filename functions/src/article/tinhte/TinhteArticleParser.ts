import {ArticleParser} from "../ArticleParser";
import Article from "../../../../model/Article";
import StoryImage from "../../../../model/StoryImage";

export default class TinhteArticleParser extends ArticleParser {

    constructor() {
        super();
    }


    parserArticle(): Article {
        const header = this.data["thread_title"];
        const id = this.data["thread_id"];
        const sourceName = "Tinh Tế";
        let sourceUrl = this.data["links"]["permalink"]
        let images = [this.data["links"]["image"]];

        let likes = this.data["first_post"]["post_like_count"];
        let time = this.data["thread_update_date"] * 1000;
        return new Article(id, header, null, this.addAttachToBody(), null, null, null, sourceUrl, sourceName, images, "", likes, time, 0);
    }


    addAttachToBody() {
        let body = this.data["first_post"]["post_body_html"];
        let attachImage: any[] = this.data["first_post"]["attachments"];
        if (attachImage.length > 0) {
            body = `${body} <img src='${attachImage[0]["links"]["data"]}'/>`
        }
        return body;

    }

}
