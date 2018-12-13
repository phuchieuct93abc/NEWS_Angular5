import {Story} from "../../../model/Story";

export abstract class StoryParser {
    protected html: Element;


    protected constructor(html: Element) {
        this.html = html;
    }

    abstract parseStory(): Story;
}
