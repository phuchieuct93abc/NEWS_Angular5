import {Story} from "../../model/Story";
import BaomoiStoryParser from "./parsers/baomoi/BaomoiStoryParser";
import {CONFIG} from "./const";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');


export default class StoryService {
    getStories(pageNumber: string): Promise<Story[]> {
        return new Promise((resolve) => {
            const url = CONFIG.baomoiUrl + `trang${pageNumber}.epi?loadmore=1`;
            console.log('url', url);
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