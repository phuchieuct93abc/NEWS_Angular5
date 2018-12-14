import {Story} from "../../../model/Story";

export abstract class StoryParser {
    protected html: Element;

    public setHtml(html: any) {
        this.html = html;
        return this;

    }


    abstract parseStory(): Story;
}
