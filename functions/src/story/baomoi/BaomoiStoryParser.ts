import { StoryParser } from '../StoryParser';
import Utility from '../../Utility';
import StoryMeta from '../../../../model/StoryMeta';
import StoryImage from '../../../../model/StoryImage';

export default class BaomoiStoryParser extends StoryParser {
  constructor() {
    super();
  }

  isValid(): boolean {
    return this.data.contentId !== undefined;
  }

  parseTitle(): string {
    return this.data.title;
  }

  parseId(): string {
    return this.data.id + '';
  }

  parseUrl(): string {
    return 'https://baomoi.com' + this.data.redirectUrl;
  }

  parseStoryMeta(): StoryMeta {
    // const meta = <HTMLElement>this.data.getElementsByClassName('story__meta')[0];
    // const source = meta.querySelector('.source img').getAttribute("alt");
    // const sourceIcon = meta.querySelector('.source img').getAttribute("src");
    // const time = meta.getElementsByClassName('friendly')[0].getAttribute('datetime');
    return new StoryMeta(this.data.publisher?.logo, this.data.publisher?.icon, this.data.date * 1000);
  }

  parseImages(): StoryImage[] {
    return [new StoryImage(this.data.thumbL, 700, 390, this.data.title)];

    // const images = this.data.getElementsByClassName('story__thumb')[0].getElementsByTagName('img');
    // let result: StoryImage[] = [];
    // for (let i = 0; i < images.length; i++) {
    //     const image = images[i];
    //     let srcUrl = image.getAttribute('data-src') || image.getAttribute('src')
    //     result.push(new StoryImage(srcUrl, image["width"], image['height'], image['alt']))
    // }

    // const videoElements = this.data.getElementsByTagName('video');
    // for (let index = 0; index < videoElements.length; index++) {
    //     let videoElement = videoElements[index];
    //     let width = videoElement.getAttribute("width")
    //     let height = videoElement.getAttribute("height")
    //     const videoUrl = videoElements[index].firstElementChild.getAttribute("src");

    //     result.push(new StoryImage(
    //         videoUrl.match(/(.)*gif/g)[0], parseInt(width), parseInt(height), null));
    // }
    // return result;
  }

  parseHasVideo(): boolean {
    return this.data.contentTypes?.[0] === 2;
  }

  parseDescription(): string {
    return this.data.description;
  }

  parseRelated(): number {
    return 0;
  }
}
