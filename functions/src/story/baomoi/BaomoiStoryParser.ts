import {Story} from "../../../model/Story";
import {StoryParser} from "../story/StoryParser";
import Utility from "../Utility";
import StoryMeta from "../../../model/StoryMeta";
import StoryImage from "../../../model/StoryImage";

export default class BaomoiStoryParser extends StoryParser {

    constructor() {
        super();
    }

    parseStory(): Story {
        if (!this.html.getElementsByClassName('story__thumb')[0]) {
            return null;
        }

        const title = this.html.getElementsByClassName('story__heading')[0].textContent;
        const hasVideo = this.html.classList.contains('story--video');
        return new Story(this.extractId(), title, '1',  this.parserStoryImages(), this.extractUrl(), this.parserStoryMeta(), hasVideo,);
    }

    private extractId(): string {
        return Utility.extractId(this.html.getElementsByTagName('a')[0].getAttribute('href').trim());

    }

    private extractUrl() {
        return this.html.getElementsByTagName('a')[0].getAttribute('href').trim();

    }

    private parserStoryMeta(): StoryMeta {

        const meta = this.html.getElementsByClassName('story__meta')[0];

        const source = meta.getElementsByClassName('source')[0].textContent;

        const time = meta.getElementsByClassName('friendly')[0].getAttribute('datetime');
        return new StoryMeta(source, time);
    }

    private parserStoryImages(): StoryImage[] {
        const images = this.html.getElementsByClassName('story__thumb')[0].getElementsByTagName('img');
        let result: StoryImage[] = [];
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            result.push(new StoryImage(image.getAttribute('data-src'), image["width"], image['height'], image['alt']))
        }
        return result;


    }

}