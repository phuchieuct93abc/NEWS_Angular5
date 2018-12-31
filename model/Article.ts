import {Story} from "./Story";

export default class Article {
    public id: string;
    public header: string;
    public meta: string;
    public body: string;
    public moreStory: string;
    public story: Story;


    constructor(id: string, header: string, meta: string, body: string, moreStory: string, story: Story = null) {
        this.id = id;
        this.header = header;
        this.meta = meta;
        this.body = body;
        this.moreStory = moreStory;
        this.story = story;
    }

    toJSON() {
        let {id, header, meta, body, moreStory} = this;
        return {id, header, meta, body, moreStory}
    }
}