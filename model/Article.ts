export default class Article {
    public id: string;
    public header: string;
    public meta: string;
    public body: string;
    public moreStory: string;


    constructor(id: string, header: string, meta: string, body: string, moreStory: string) {
        this.id = id;
        this.header = header;
        this.meta = meta;
        this.body = body;
        this.moreStory = moreStory;
    }

    toJSON() {
        let {id, header, meta, body, moreStory} = this;
        return {id, header, meta, body, moreStory}
    }
}