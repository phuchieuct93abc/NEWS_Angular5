import {StoryParser} from "../StoryParser";
import StoryImage from "../../../../model/StoryImage";
import StoryMeta from "../../../../model/StoryMeta";

export default class GoogleStoryParser extends StoryParser {
    parseTitle(): string {
        throw new Error("Method not implemented.");
    }

    parseId(): string {
        throw new Error("Method not implemented.");
    }

    parseUrl(): string {
        throw new Error("Method not implemented.");
    }

    parseStoryMeta(): StoryMeta {
        throw new Error("Method not implemented.");
    }

    parseImages(): StoryImage[] {
        throw new Error("Method not implemented.");
    }

    parseHasVideo(): boolean {
        throw new Error("Method not implemented.");
    }

    parseDescription(): string {
        throw new Error("Method not implemented.");
    }

    isValid(): boolean {
        throw new Error("Method not implemented.");
    }

    parseRelated(): number {
        return 0;
    }


}
