import {Diffbot} from "./Diffbot";
import FirebaseService from "../src/FirebaseService";

var Diffbot = require('diffbot').Diffbot;


export default class DiffbotService {
    constructor(private uri: string) {
    }

    get(): Promise<Diffbot> {
        return new Promise(resolve => {

            FirebaseService.getDiffBotCredential().then(token => {
                let diffbot = new Diffbot(token)
                diffbot.article({uri: this.uri}, function (err, response: Diffbot) {
                    resolve(response)
                });

            })

        })
    }
}
