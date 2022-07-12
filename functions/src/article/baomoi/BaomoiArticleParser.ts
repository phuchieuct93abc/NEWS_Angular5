import Article from '../../../../model/Article';
import { ArticleParser } from '../ArticleParser';
import { BaomoiData } from './BaoMoiArticleTypes';
import { BodyElementParser } from './BodyElementParser';
import { ImageParser } from './ImageParser';
import { TextParser } from './TextParser';
import { VideoParser } from './VideoParser';

export default class BaomoiArticleParser extends ArticleParser<BaomoiData> {
  constructor() {
    super();
  }

  private convertHtmlBody(): string {
    return (this.data.bodys as any[])
      ?.map((body) => {
        if (body.type === 'text') {
          return new TextParser(body);
        }
        if (body.type === 'image') {
          return new ImageParser(body);
        }
        if (body.type === 'video') {
          return new VideoParser(body);
        }
      })
      .filter((parser) => parser !== undefined)
      .map((parser: any) => (parser as BodyElementParser<any>).parser())
      .join('');
  }

  parserArticle(): Article {
    const header = this.data.title;
    const id = this.data.id.toString();
    let sourceUrl = this.data.originalUrl;
    let images = [this.data.thumbL];
    const description = this.data.description;

    let likes = this.data.totalLike;
    let time = this.data.publishedDate * 1000;

    let sourceName = this.data.publisher.name;
    let sourceIconUrl = this.data.publisher.logo;

    return new Article(
      id,
      header,
      null,
      this.convertHtmlBody(),
      null,
      null,
      null,
      sourceUrl,
      sourceName,
      sourceIconUrl,
      images,
      description,
      likes,
      time,
      0
    );
  }

}
