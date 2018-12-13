import {Story} from "../../model/Story";
import BaomoiStoryParser from "./parsers/baomoi/BaomoiStoryParser";
import {CONFIG} from "./const";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');


export default class StoryService {
    getStories(pageNumber: string, category: string): Promise<Story[]> {
        return new Promise((resolve) => {
            const url = CONFIG.baomoiUrl + `${category}/trang${pageNumber}.epi?loadmore=1`;
            axios.get(url).then(response => {
                const dom = new JSDOM(response.data);
                const result: HTMLCollection = dom.window.document.getElementsByClassName("story");
                let stories = Array.from(result)
                    .map(r => {
                        return new BaomoiStoryParser(r).parseStory()

                    })
                    .filter(r => r != null);
                resolve(stories)
            })
        })


    }

}