import { Story } from '../../../../../model/Story';
import StoryImage from '../../../../../model/StoryImage';
import StoryMeta from '../../../../../model/StoryMeta';
import { Thread } from './tinhte.type';

export default class TinhteStoryParser {
  constructor(private data: Thread) {}

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

  private parseTitle(): string {
    return this.data.thread_title;
  }

  private parseId(): string {
    return this.data.content_id + '';
  }

  private parseUrl(): string {
    return this.data.links.permalink;
  }

  private parseStoryMeta(): StoryMeta {
    return new StoryMeta('Tinh tế', 'https://tinhte.vn/favicon.ico', this.data['thread_create_date'] * 1000); //Correct format time for tinhte only
  }

  private parseImages(): StoryImage[] {
    const thumbnail = this.data.thread_image;
    let storyImage = new StoryImage(thumbnail.link, thumbnail.width, thumbnail.height);
    return [storyImage];
  }

  private parseHasVideo(): boolean {
    return false;
  }

  private parseDescription(): string {
    return this.data.first_post.post_body;
  }

  private isValid(): boolean {
    return true;
  }

  private parseRelated(): number {
    return 0;
  }
}
