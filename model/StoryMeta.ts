export default class StoryMeta {
    public source: string;
    public time: string|number;

    constructor(source: string, time: string|number) {
        this.source = source;
        this.time = time;
    }
}
