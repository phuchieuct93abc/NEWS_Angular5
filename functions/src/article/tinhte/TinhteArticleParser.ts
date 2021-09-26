import {ArticleParser} from "../ArticleParser";
import Article from "../../../../model/Article";
import { Attachment, TinhteData } from "./TInhTeArticleType";
import { VideoParser } from "../baomoi/VideoParser";

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
        let attachments = this.data.first_post.attachments; 
        if(attachments?.length > 0){
            const firstAttachments = attachments[0];
            if(firstAttachments.attachment_is_video){            
                return this.addVideoAttachment(firstAttachments, body);
            }else{
                let attachment = firstAttachments.links.data;
                if(body.indexOf(attachment)===-1){
                    return `<img class="thumbnail-inner" src='${attachment}'/> ${body}`
                }
            }
        }
       
        return body;

    }


    private addVideoAttachment(firstAttachments: Attachment, body: string) {
        const videoHtml = new VideoParser({
            content: firstAttachments.links.data,
            originUrl: firstAttachments.links.data,
            height: 320 ,
            width: 320  * firstAttachments.video_ratio,
            poster: firstAttachments.links.thumbnail,
            type: 'video'
        }).parser();
        return `${videoHtml} ${body}`;
    }
}
