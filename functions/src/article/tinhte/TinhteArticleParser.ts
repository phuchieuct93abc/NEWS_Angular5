import {ArticleParser} from "../ArticleParser";
import Article from "../../../../model/Article";
import { TinhteData } from "./TInhTeArticleType";

export default class TinhteArticleParser extends ArticleParser<TinhteData> {

    constructor() {
        super();
    }


    parserArticle(): Article {
        const header = this.data.thread_title;
        const id = this.data.thread_id;
        const sourceName = "Tinh Tế";
        let sourceUrl = this.data.links.permalink
        let images = [this.data.links.image];

        let likes = this.data.first_post.post_like_count;
        let time = this.data.thread_update_date * 1000;
        return new Article(id.toString(), header, null, this.addAttachToBody(), null, null, null, sourceUrl, sourceName, "https://tinhte.vn/favicon.ico",images, "", likes, time, 0);
    }
 
    

    addAttachToBody() {
        let body = this.data.first_post.post_body_html;
        let attachImage = this.data.first_post.attachments; 
        if (attachImage?.length > 0) {
            let thumbnail = attachImage[0].links.data;
            if(body.indexOf(thumbnail)===-1){
                body = `<img class="thumbnail-inner" src='${thumbnail}'/> ${body} `

            }
        }
        return body;

    }

}
