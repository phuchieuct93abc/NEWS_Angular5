import StoryMeta from "./StoryMeta";
import StoryImage from "./StoryImage";

export class Story {

    constructor(public id: string,
                public  title: string,
                public desc: string,
                public  imagePath: string,
                public images: StoryImage[],
                public  originalUrl: string,
                public  storyMeta: StoryMeta,
                public hasVideo: boolean,
    ) {
    }

}