import Article from '../../../../../model/Article';
import { ImageParser } from './tinhte-image-parser.service';
import { Thread, Attachment } from './tinhte.type';
import { VideoParser } from './video-parser.service';

export default class TinhteArticleParser {
  constructor(private data: Thread) {}

  parserArticle(): Article {
    const header = this.data.thread_title;
    const id = this.data.thread_id;
    const sourceName = 'Tinh Tế';
    let sourceUrl = this.data.links.permalink;
    let images = [this.data.links.image];

    let likes = this.data.first_post.post_like_count;
    let time = this.data.thread_update_date * 1000;
    return new Article(
      id.toString(),
      header,
      null,
      this.addAttachToBody(),
      null,
      null,
      null,
      sourceUrl,
      sourceName,
      'https://tinhte.vn/favicon.ico',
      images,
      '',
      likes,
      time,
      0
    );
  }

  addAttachToBody() {
    let body = this.data.first_post.post_body_html;
    let attachments = this.data.first_post.attachments;
    const attachmentHtml = attachments
      ?.filter((attachment) => !body.includes(attachment.links.data))
      .map((attachment) => {
        if (attachment.attachment_is_video) {
          return this.getVideoAttachment(attachment);
        } else {
          return this.getImageAttachment(attachment);
        }
      })
      .join('<br/>');

    return `${body} <div class="attachments">${attachmentHtml}</div> `;
  }
  getImageAttachment(attachment: Attachment): string {
    return new ImageParser({
      type: 'image',
      content: attachment.links.data,
      contentOrigin: attachment.links.data,
      originUrl: attachment.links.data,
      height: attachment.attachment_height,
      width: attachment.attachment_width,
    }).parser();
  }

  private getVideoAttachment(firstAttachments: Attachment): string {
    return new VideoParser({
      content: firstAttachments.links.data,
      originUrl: firstAttachments.links.data,
      height: 320,
      width: 320 * firstAttachments.video_ratio,
      poster: firstAttachments.links.thumbnail,
      type: 'video',
    }).parser();
  }
}
