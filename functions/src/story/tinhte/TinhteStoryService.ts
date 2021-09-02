import {Story} from "../../../../model/Story";
import {StoryService} from "../StoryService";

import TinhteStoryParser from "./TinhteStoryParser";


export default class TinhteStoryService extends StoryService {
    public pageNumber: number;
    public static urlApi = "https://tinhte.vn/appforo/index.php?threads/promoted&limit=30&page=${page}&oauth_token=qcunuxxyhhbt5ifhj80g6liz44thgdz7";

    constructor(protected url: string, protected  category:string) {
        super(url, new TinhteStoryParser(), category)
    }


    queryStories(data: any): any[] {
        return data.data.threads;
    }

    search(pageNumber: string, keyword: string): Promise<Story[]> {
        return undefined;
    }

    static createInstance(pageNumber: number) {

        let tinhteUri = TinhteStoryService.urlApi.replace("${page}", pageNumber + "");
        const tinhteStoryService = new TinhteStoryService(tinhteUri, 'tinh-te');
        tinhteStoryService.pageNumber = pageNumber;
        return tinhteStoryService;

    }


}
