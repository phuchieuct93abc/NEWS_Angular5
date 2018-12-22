import {Story} from "../../../model/Story";
import {StoryParser} from "../parsers/StoryParser";

export default class GoogleStoryParser extends StoryParser {

    constructor() {
        super();
    }


    parseStory(): Story {
        if (!this.html.getElementsByClassName('story__thumb')[0]) {
            return null;
        }
        const imagePath = this.html.getElementsByTagName('img')[0].getAttribute('data-src');

        const title = this.html.getElementsByClassName('story__heading')[0].textContent;
        return new Story(this.extractId(), title, '1', imagePath, this.extractUrl(), null,null)
    }

    private extractId(): string {
        const regex = /(\d)+(.epi)+$/gm;
        const id = this.html.getElementsByTagName('a')[0].getAttribute('href').trim();

        const m = regex.exec(id);
        return m[0].replace('.epi', '');
    }

    private extractUrl() {
        return this.html.getElementsByTagName('a')[0].getAttribute('href').trim();

    }

}