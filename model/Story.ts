import StoryMeta from "./StoryMeta";

export class Story {

    constructor(public id: string,
                public  title: string,
                public desc: string,
                public  imagePath: string,
                public  originalUrl: string,
                public  storyMeta: StoryMeta) {
    }

}