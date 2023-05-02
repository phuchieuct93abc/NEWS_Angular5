import { StoryParser } from '../StoryParser';
import Utility from '../../Utility';
import StoryMeta from '@model/StoryMeta';
import StoryImage from '@model/StoryImage';

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
    return new StoryMeta(this.data.publisher?.logo, this.data.publisher?.icon, this.data.date * 1000);
  }

  parseImages(): StoryImage[] {
    return [new StoryImage(this.data.thumbL, 700, 390, this.data.title)];
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
