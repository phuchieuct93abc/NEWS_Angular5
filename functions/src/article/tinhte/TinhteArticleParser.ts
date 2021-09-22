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
        //TOTO attachment as video:
        // {
        //     attachment_id: 5179699,
        //     attachment_download_count: 0,
        //     filename: 'video.mp4',
        //     links: {
        //       permalink: 'https://photo2.tinhte.vn/data/attachment-files/2021/09/5649702_video.mp4',
        //       data: 'https://photo2.tinhte.vn/data/attachment-files/2021/09/5649702_video.mp4',
        //       thumbnail: 'https://9932704de5fc5c8.cmccloud.com.vn/videos/2021/09/5649702/gif/5649702_4d8c874d4f7f3c91ba008ca8257ce5ba.gif',
        //       video_url: 'https://9932704de5fc5c8.cmccloud.com.vn/videos/2021/09/5649702/540p/b9331e307f3c48bf8db9cd52c3ebaea3.mp4',
        //       post: 'https://tinhte.vn/appforo/index.php?posts/61001488/'
        //     },
        //     attachment_is_video: true,
        //     attachment_video_is_processing: false,
        //     video_ratio: 0.56,
        //     post_id: 61001488,
        //     permissions: { view: true, delete: false },
        //     attachment_is_inserted: false
        //   }
        if (attachImage?.length > 0) {
            let thumbnail = attachImage[0].links.data;
            if(body.indexOf(thumbnail)===-1){
                body = `<img class="thumbnail-inner" src='${thumbnail}'/> ${body} `

            }
        }
        return body;

    }

}
