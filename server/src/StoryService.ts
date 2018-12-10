import {Story} from "../../model/Story";
import StoryParser from "./parsers/StoryParser";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const axios = require('axios');

export default class StoryService {
    getAllStories(): Promise<Story[]> {
        return new Promise((resolve) => {
            axios.get("https://m.baomoi.com/").then(response => {
                const dom = new JSDOM(response.data);
                const result: HTMLCollection = dom.window.document.getElementsByClassName("story");
                resolve(Array.from(result).map(r => {
                        return new StoryParser(r).story;
                    }).filter(r => r != null)
                )
            })
        })


    }
}