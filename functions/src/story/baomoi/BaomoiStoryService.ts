import {Story} from "../../../../model/Story";
import BaomoiStoryParser from "./BaomoiStoryParser";
import {CONFIG} from "../../const";
import {StoryService} from "../StoryService";
import {Categories} from "../../../../model/Categories";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');


export default class BaomoiStoryService extends StoryService {
    queryStories(response): HTMLCollection {
        const dom = new JSDOM(response);

        return dom.getElementsByClassName("story")
    }

    constructor(protected url: string) {
        super(url, new BaomoiStoryParser())
    }

    static createInstance(pageNumber: string, category: string) {

        let url = `${CONFIG.baomoiUrl}${this.getCategoryUrl(category)}trang${pageNumber}.epi?loadmore=1`;
        return new BaomoiStoryService(url);

    }

    search(pageNumber: string, keyword: string): Promise<Story[]> {
        let searchUrl = encodeURI(`${CONFIG.baomoiUrl}tim-kiem/${keyword}/trang${pageNumber}.epi`);

        return new Promise(resolver => {
            axios.get(searchUrl).then(response => {
                const dom = new JSDOM(response.data);
                const result: HTMLCollection = dom.window.document.getElementsByClassName("story");
                let stories = Array.from(result)
                    .map(r => this.storyParser.setHtml(r).parseStory())
                    .filter(r => r != null);
                resolver(stories);
            })


        })

    }

    private static getCategoryUrl(name: string): string {
        const category = Categories.find(category => category.name == name);
        if (category == null) {
            console.error(`Name null: ${name}`)
            return ""
        }
        return category.url != null ? category.url : category.name + "/";
    }


}
