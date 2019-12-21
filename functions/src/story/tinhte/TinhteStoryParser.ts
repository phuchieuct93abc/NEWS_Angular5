import {StoryParser} from "../StoryParser";
import StoryImage from "../../../../model/StoryImage";
import StoryMeta from "../../../../model/StoryMeta";

export default class TinhteStoryParser extends StoryParser {
    parseTitle(): string {
        return this.data["thread_title"]
    }

    parseId(): string {
        return this.data["content_id"] + ""

    }

    parseUrl(): string {
        return "title"
    }

    parseStoryMeta(): StoryMeta {
        return new StoryMeta("Tinh tế","https://tinhte.vn/favicon.ico", this.data["thread_update_date"] * 1000);//Correct format time for tinhte only
    }

    parseImages(): StoryImage[] {
        const thumbnail = this.data["thread_thumbnail"];
        let storyImage = new StoryImage(thumbnail["link"], thumbnail["width"], thumbnail["height"]);
        return [storyImage];
    }

    parseHasVideo(): boolean {
        return false;
    }

    parseDescription(): string {
        return this.data["first_post"]["post_body"];
    }

    isValid(): boolean {
        return true;
    }

    parseRelated(): number {
        return 0;
    }


}
