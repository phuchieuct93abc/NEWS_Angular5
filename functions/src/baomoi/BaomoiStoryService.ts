import {Story} from "../../../model/Story";
import BaomoiStoryParser from "./BaomoiStoryParser";
import {CONFIG} from "../const";
import {StoryService} from "../StoryService";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');


export default class BaomoiStoryService extends StoryService {

    constructor() {
        super();
        this.storyParser = new BaomoiStoryParser();
    }

    getStories(pageNumber: string, category: string): Promise<Story[]> {
        return new Promise((resolve) => {
            const url = CONFIG.baomoiUrl + `${category}/trang${pageNumber}.epi?loadmore=1`;
            axios.get(url).then(response => {
                const dom = new JSDOM(response.data);
                const result: HTMLCollection = dom.window.document.getElementsByClassName("story");
                let stories = Array.from(result)
                    .map(r => {
                        return this.storyParser.setHtml(r).parseStory();

                    })
                    .filter(r => r != null);
                resolve(stories)
            })
        })


    }

}