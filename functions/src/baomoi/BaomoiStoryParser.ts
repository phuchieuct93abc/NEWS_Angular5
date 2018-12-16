import {Story} from "../../../model/Story";
import {StoryParser} from "../parsers/StoryParser";
import Utility from "../Utility";
import StoryMeta from "../../../model/StoryMeta";

export default class BaomoiStoryParser extends StoryParser {

    constructor() {
        super();
    }

    parseStory(): Story {
        if (!this.html.getElementsByClassName('story__thumb')[0]) {
            return null;
        }
        const imagePath = this.html.getElementsByTagName('img')[0].getAttribute('data-src');

        const title = this.html.getElementsByClassName('story__heading')[0].textContent;
        return new Story(this.extractId(), title, '1', imagePath, this.extractUrl(), this.parserStoryMeta());
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
        console.log(time);
        return new StoryMeta(source, time);
    }

}