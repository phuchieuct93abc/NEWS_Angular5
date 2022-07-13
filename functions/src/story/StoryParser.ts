import { Story } from '../../../model/Story';
import StoryImage from '../../../model/StoryImage';
import StoryMeta from '../../../model/StoryMeta';

export abstract class StoryParser<T = any> {
  protected data: T;

  public setData(data: T) {
    this.data = data;
    return this;
  }

  public parseStory(): Story {
    try {
      if (!this.isValid()) {
        return null;
      }
      let title = this.parseTitle();

      let id = this.parseId();
      let hasVideo = this.parseHasVideo();
      let url = this.parseUrl();
      let images = this.parseImages();
      let meta = this.parseStoryMeta();
      let description = this.parseDescription();
      const story = new Story(id, title, description, images, url, meta, hasVideo);
      story.related = this.parseRelated();
      return story;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  abstract parseTitle(): string;

  abstract parseId(): string;

  abstract parseUrl(): string;

  abstract parseStoryMeta(): StoryMeta;

  abstract parseImages(): StoryImage[];

  abstract parseHasVideo(): boolean;

  abstract parseDescription(): string;

  abstract isValid(): boolean;

  abstract parseRelated(): number;
}
