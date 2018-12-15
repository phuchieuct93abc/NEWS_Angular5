import {Story} from "../../../model/Story";
import {StoryParser} from "../parsers/StoryParser";
import Utility from "../Utility";

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
        return new Story(this.extractId(), title, '1', imagePath, this.extractUrl())
    }

    private extractId(): string {
        return Utility.extractId(this.html.getElementsByTagName('a')[0].getAttribute('href').trim());

    }

    private extractUrl() {
        return this.html.getElementsByTagName('a')[0].getAttribute('href').trim();

    }

}