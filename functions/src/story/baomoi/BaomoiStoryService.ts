import { Story } from "../../../../model/Story";
import BaomoiStoryParser from "./BaomoiStoryParser";
import { CONFIG } from "../../const";
import { StoryService } from "../StoryService";
import CategoryHelper from "../../../../model/Categories";
import Categories from "../../../../model/Categories";
import { createHmac } from 'crypto';

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');
const baomoiStoryparams = "https://baomoi.com/api/v1/content/get/list-by-type?listType=3&listId={categoryId}&page={page}&ctime=1624697699&version=0.1.7&sig={sig}&apiKey=kI44ARvPwaqL7v0KuDSM0rGORtdY1nnw"

export default class BaomoiStoryService extends StoryService {

    queryStories(response): any[] {
        return response.data.data.items
    }

    constructor(protected url: string, category: string) {
        super(url, new BaomoiStoryParser(), category)
    }

    static createInstance(pageNumber: string, category: string) {

        const categoryId = CategoryHelper.getCategory(category).id + '';
        const baseParamSign = `/api/v1/content/get/list-by-typectime=1624697699listId=${categoryId}listType=3page=${pageNumber}version=0.1.7`;
        const sig = createHmac('sha256', '882QcNXV4tUZbvAsjmFOHqNC1LpcBRKW').update(baseParamSign).digest("hex");
        let url = baomoiStoryparams
            .replace("{page}", pageNumber)
            .replace("{categoryId}", categoryId)
            .replace("{sig}", sig);
        return new BaomoiStoryService(url, category);

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




}
