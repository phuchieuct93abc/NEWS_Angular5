import moment from "../functions/utils/moment.service";

export default class StoryMeta {
    public source: string;
    public time: string|number;
    public timeago:string

    constructor(source: string, time: string|number) {
        this.source = source;
        this.time = time;
        this.timeago = moment.timeago(this.time);
    }
}
