import {Story} from "../../../model/Story";

export default class StoryParser {
    public story: Story;


    constructor(private html: Element) {
        if (!html.getElementsByClassName('story__thumb')[0]) {
            return null;
        }
        const imagePath = html.getElementsByTagName('img')[0].getAttribute('src');
        const title = html.getElementsByClassName('story__heading')[0].textContent
        this.story = new Story(this.extractId(), title, '1', imagePath,this.extractUrl())
    }



    private extractId(): string {
        const regex = /(\d)+(.epi)+$/gm;

        const id = this.html.getElementsByTagName('a')[0].getAttribute('href').trim();

        const m = regex.exec(id)
        return m[0].replace('.epi', '');
    }
    private extractUrl(){
        return this.html.getElementsByTagName('a')[0].getAttribute('href').trim();

    }

}