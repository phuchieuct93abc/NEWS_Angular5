export class Story {
    private id: string;

    private title: string;

    private desc: string;

    private imagePath: string;

    private originalUrl: string;

    constructor(id: string, title: string, desc: string, imagePath: string, originalUrl: string) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        this.imagePath = imagePath;
        this.originalUrl = originalUrl;
    }

}