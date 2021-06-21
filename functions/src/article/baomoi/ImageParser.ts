import { BodyElementParser } from "./BaomoiArticleParser";
interface ImageParserI {
    content: string
    contentOrigin: string
    height: number
    originUrl: string
    type: "image"
    width: number
}
export class ImageParser implements BodyElementParser<ImageParserI>{
    parser(body: ImageParserI) {
        throw new Error("Method not implemented.");
    }

}