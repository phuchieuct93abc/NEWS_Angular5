import { StoryParser } from "../StoryParser";
import Utility from "../../Utility";
import StoryMeta from "../../../../model/StoryMeta";
import StoryImage from "../../../../model/StoryImage";

export default class BaomoiStoryParser extends StoryParser {
    constructor() {
        super();
    }

    isValid(): boolean {
        return this.data.getElementsByClassName('story__thumb')[0] !== undefined;
    }

    parseTitle(): string {
        return this.data.getElementsByClassName('story__heading')[0].textContent;
    }

    parseId(): string {
        return Utility.extractId(this.data.getElementsByTagName('a')[0].getAttribute('href').trim());
    }

    parseUrl(): string {
        return this.data.getElementsByTagName('a')[0].getAttribute('href').trim();
    }

    parseStoryMeta(): StoryMeta {
        const meta = <HTMLElement>this.data.getElementsByClassName('story__meta')[0];
        const source = meta.getElementsByClassName('source')[0].textContent;
        const time = meta.getElementsByClassName('friendly')[0].getAttribute('datetime');
        return new StoryMeta(source, BaomoiStoryParser.getSourceIconUrl(meta), time);
    }

    parseImages(): StoryImage[] {
        const images = this.data.getElementsByClassName('story__thumb')[0].getElementsByTagName('img');
        let result: StoryImage[] = [];
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            result.push(new StoryImage(image.getAttribute('src'), image["width"], image['height'], image['alt']))
        }

        const videoElements = this.data.getElementsByTagName('video');
        for (let index = 0; index < videoElements.length; index++) {
            let videoElement = videoElements[index];
            let width = videoElement.getAttribute("width")
            let height = videoElement.getAttribute("height")
            const videoUrl = videoElements[index].firstElementChild.getAttribute("src");

            result.push(new StoryImage(
                videoUrl.match(/(.)*gif/g)[0], parseInt(width), parseInt(height), null));
        }
        return result;
    }

    parseHasVideo(): boolean {
        return this.data.classList.contains('story--video');
    }

    parseDescription(): string {

        const storySummary = this.data.querySelector(".story__summary");
        return storySummary && storySummary.textContent;
    }

    parseRelated(): number {
        const relatedElement = this.data.querySelector(".story__tools a");
        return parseInt(relatedElement ? relatedElement.textContent : "0");
    }

    public static getSourceIconUrl(meta: HTMLElement):string {
        const sourceId = meta.getElementsByTagName("a")[0].getAttribute("href");

        var rx = /\/([0-9]*).epi/g;
        var arr = rx.exec(sourceId);
        return `http://s.baomoi.xdn.vn/icon_publishers/${arr[1]}.png`
    }


}
