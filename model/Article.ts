import {Story} from "./Story";

export default class Article {
    public id: string;
    public header: string;
    public meta: string;
    public body: string;
    public moreStory: string;
    public story: Story;
    public externalUrl: string


    constructor(id: string, header: string, meta: string, body: string, moreStory: string, story: Story = null, externalUr: string = null) {
        this.id = id;
        this.header = header;
        this.meta = meta;
        this.body = body;
        this.moreStory = moreStory;
        this.story = story;
        this.externalUrl = externalUr;
    }

    toJSON() {
        let {id, header, meta, body, moreStory} = this;
        return {id, header, meta, body, moreStory}
    }
}