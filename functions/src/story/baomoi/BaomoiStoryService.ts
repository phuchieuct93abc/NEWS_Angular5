import {Story} from "../../../../model/Story";
import BaomoiStoryParser from "./BaomoiStoryParser";
import {CONFIG} from "../../const";
import {StoryService} from "../StoryService";
import CategoryHelper from "../../../../model/Categories";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');


export default class BaomoiStoryService extends StoryService {
    static baomoiStoryUrl = "https://baomoi.com/api/v1/content/get/list-by-type?listType=1&listId=0&page={page}&isNoAdBanner=true&platform=2&ctime=1624285115&version=0.1.3&sig=b783b9b7733c65921df59e9cac7ecc9200fb7e54ece35ed56ade75485eede5f4&apiKey=kI44ARvPwaqL7v0KuDSM0rGORtdY1nnw"

    queryStories(response): any[] {
        return response.data.data.items
    }

    constructor(protected url: string,category:string) {
        super(url, new BaomoiStoryParser(),category)
    }

    static createInstance(pageNumber: string, category: string) {

        // let url = `${CONFIG.baomoiUrl}${this.getCategoryUrl(category)}trang${pageNumber}.epi`;
        let url = BaomoiStoryService.baomoiStoryUrl.replace("{page}",pageNumber)
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

        const category = CategoryHelper.getCategory(name);
        if (category == null) {
            return ""
        }
        return category.url != null ? category.url : category.name + "/";
    }


}
