import {Story} from "../../model/Story";
import {StoryParser} from "./parsers/StoryParser";


export abstract class StoryService {
    protected storyParser: StoryParser;

    abstract getStories(pageNumber: string, category: string): Promise<Story[]>


}
