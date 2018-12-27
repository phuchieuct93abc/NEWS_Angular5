import {Story} from "../../../model/Story";
import {StoryParser} from "../parsers/StoryParser";
import {GoogleArticle} from "./GoogleStoryService";
import StoryImage from "../../../model/StoryImage";
import StoryMeta from "../../../model/StoryMeta";

export default class GoogleStoryParser extends StoryParser {

    constructor() {
        super();
    }


    parseStory(): Story {
        const article = <GoogleArticle>this.rawData;
        const image = new StoryImage(article.urlToImage, null, null, null)
        return new Story(article.source.id,
            article.title, article.description, [image], article.url, new StoryMeta(article.source.name, article.publishedAt), null)

    }


}