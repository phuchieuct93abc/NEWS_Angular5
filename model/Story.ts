export class Story {
    public id: string;

    public title: string;

    public desc: string;

    public imagePath: string;

    public originalUrl: string;

    constructor(id: string, title: string, desc: string, imagePath: string, originalUrl: string) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.imagePath = imagePath;
        this.originalUrl = originalUrl;
    }

}