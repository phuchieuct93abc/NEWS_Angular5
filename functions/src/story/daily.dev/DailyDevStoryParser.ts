import StoryImage from '../../../../model/StoryImage';
import StoryMeta from '../../../../model/StoryMeta';
import { StoryParser } from '../StoryParser';
import { Edge } from './DailyDevType';

export default class DailyDevStoryParser extends StoryParser<Edge> {
  parseTitle(): string {
    return this.data.node.title;
  }

  parseId(): string {
    return this.data.node.id;
  }

  parseUrl(): string {
    return this.data.node.permalink;
  }

  parseStoryMeta(): StoryMeta {
    return new StoryMeta(this.data.node.source.name, this.data.node.source.image, new Date(this.data.node.createdAt).getTime()); //Correct format time for tinhte only
  }

  parseImages(): StoryImage[] {
    const image = new StoryImage(this.data.node.image, 100, 100, this.data.node.title);
    return [image];
  }

  parseHasVideo(): boolean {
    return false;
  }

  parseDescription(): string {
    return '';
  }

  isValid(): boolean {
    return true;
  }

  parseRelated(): number {
    return 0;
  }
}
