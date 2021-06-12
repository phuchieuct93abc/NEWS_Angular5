import { Story } from "./Story";

export default class Article {

    private thumbnail: string;
    category:string;


    constructor(public id?: string,
        public header?: string,
        public meta?: string,
        public body?: string,
        public moreStory?: string,
        public story: Story = null,
        public externalUrl: string = null,
        public sourceUrl?: string,
        public sourceName?: string,
        public sourceIcon?: string,
        public images?: string[],
        public description?: string,
        public likes = 1,
        public time: string | number = new Date().toISOString(),
        public related = 0) {


    }

    toA() {
        return JSON.parse(JSON.stringify(this));
    }
    public getThumbnail(): string{
        if(this.thumbnail){
            return this.thumbnail;
        }
        this.thumbnail = this.images.find(imageUrl=>{
            //Ignore news source icon
            return !new RegExp(/https:\/\/photo-baomoi\.zadn\.vn\/\w*\.png/gm).test(imageUrl);
        })
        return this.thumbnail;
    }
}
