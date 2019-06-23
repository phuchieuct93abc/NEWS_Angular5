import {Story} from "../../../../model/Story";
import {StoryService} from "../StoryService";

import axios from 'axios';
import StoryImage from "../../../../model/StoryImage";
import StoryMeta from "../../../../model/StoryMeta";
import TinhteStoryParser from "./TinhteStoryParser";
import {NEWS} from "../google-news/NEWS";


export default class TinhteStoryService extends StoryService {
    public pageNumber: number;
    public static urlApi = "https://tinhte.vn/appforo/index.php?threads/promoted&limit=30&page=${page}&oauth_token=0%2C1561219753%2C10c550790aa97f8a679ff8d4e0bd350d%2Clxi7g2zolu";

    constructor(protected url: string) {
        super(url, new TinhteStoryParser(),null)
    }


    queryStories(data: any): any[] {
        return data.data.threads;
    }

    search(pageNumber: string, keyword: string): Promise<Story[]> {
        return undefined;
    }

    static createInstance(pageNumber: number) {

        let tinhteUri = TinhteStoryService.urlApi.replace("${page}",pageNumber+"");
        const tinhteStoryService = new TinhteStoryService(tinhteUri);
        tinhteStoryService.pageNumber = pageNumber;
        return tinhteStoryService;

    }



}
