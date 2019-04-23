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
                public likes = 1,
                public time = new Date().toISOString()) {
    }

    toA() {
        return JSON.parse(JSON.stringify(this));
    }
}
