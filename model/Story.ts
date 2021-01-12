import StoryMeta from "./StoryMeta";
import StoryImage from "./StoryImage";

export class Story {
    public isFavorite: boolean;

    public isTouch = false;
    public isActive = false;
    public isSelectedBefore = false;
    private _selected_1 = false;
    public get selected() {
        return this._selected_1;
    }
    public set selected(value) {
        console.log(value)
        this._selected_1 = value;
    }
    constructor(
        public id: string,
        public title: string,
        public desc: string,
        public images: StoryImage[],
        public originalUrl: string,
        public storyMeta: StoryMeta,
        public hasVideo: boolean,
        public isRead: boolean = false,
        public isAutoOpen = false,
        private _selected = false,
        public height = 0,
        public isExpandedComment = false,
        public related = 0,
    ) {
        this.selected = _selected;
    }
}
