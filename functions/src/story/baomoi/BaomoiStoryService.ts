import {Story} from "../../../../model/Story";
import BaomoiStoryParser from "./BaomoiStoryParser";
import {CONFIG} from "../../const";
import {StoryService} from "../StoryService";
import CategoryHelper from "../../../../model/Categories";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');


export default class BaomoiStoryService extends StoryService {
    queryStories(response): any[] {
        const dom = new JSDOM(response.data);

        return dom.window.document.getElementsByClassName("story")
    }

    constructor(protected url: string,category:string) {
        super(url, new BaomoiStoryParser(),category)
    }

    static createInstance(pageNumber: string, category: string) {

        let url = `${CONFIG.baomoiUrl}${this.getCategoryUrl(category)}trang${pageNumber}.epi?loadmore=1`;
      console.log(url)
        return new BaomoiStoryService(url,category);

    }

    search(pageNumber: string, keyword: string): Promise<Story[]> {
        let searchUrl = encodeURI(`${CONFIG.baomoiUrl}tim-kiem/${keyword}/trang${pageNumber}.epi`);

        return new Promise(resolver => {
            axios.get(searchUrl).then(response => {
                const dom = new JSDOM(response.data);
                const result: HTMLCollection = dom.window.document.getElementsByClassName("story");
                let stories = Array.from(result)
                    .map(r => this.storyParser.setData(r).parseStory())
                    .filter(r => r != null);
                resolver(stories);
            })


        })

    }

    private static getCategoryUrl(name: string): string {

        const category = CategoryHelper.findByName(name);
        if (category == null) {
            return ""
        }
        return category.url != null ? category.url : category.name + "/";
    }


}
