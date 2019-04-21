import {Diffbot} from "./Diffbot";

var Diffbot = require('diffbot').Diffbot;

var diffbot = new Diffbot('54873cfd70cfd918563bab27d9a67b5d'); // your API key here

export default class DiffbotService {
    constructor(private uri: string) {
    }

    get(): Promise<Diffbot> {
        return new Promise(resolve => {
            diffbot.article({uri: this.uri}, function (err, response: Diffbot) {
                resolve(response)
            });
        })
    }
}
