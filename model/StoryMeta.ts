import moment from "../functions/utils/moment.service";

export default class StoryMeta {
    public source: string;
    public time: string | number;
    public sourceIcon: string

    constructor(source: string, sourceIcon: string, time: string | number) {
        this.source = source;
        this.time = time;
        this.sourceIcon = sourceIcon;
    }
}
