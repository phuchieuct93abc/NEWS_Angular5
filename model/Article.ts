import {Story} from "./Story";

export default class Article {


    constructor(public id: string,
                public header: string,
                public meta: string,
                public body: string,
                public  moreStory: string,
                public  story: Story = null,
                public   externalUrl: string = null,
                public  sourceUrl: string,
                public   sourceName: string,
                public  images: string[],
                public   description: string,
                public likes = 1) {
    }

    toJSON() {
        let {id, header, meta, body, moreStory,externalUrl, sourceName, sourceUrl, images, description, likes} = this;
        return {id, header, meta, body, moreStory,externalUrl, sourceName, sourceUrl, images, description, likes};
    }
}
