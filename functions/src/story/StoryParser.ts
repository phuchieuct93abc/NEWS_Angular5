import {Story} from "../../../model/Story";

export abstract class StoryParser {
    protected html: Element;
    protected rawData: any;

    public setHtml(html: any) {
        this.html = html;
        return this;

    }

    public setRawData(rawData: any) {
        this.rawData = rawData;
        return this;
    }


    abstract parseStory(): Story;
}
