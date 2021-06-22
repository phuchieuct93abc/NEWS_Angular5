import Article from "../../../model/Article";

export abstract class ArticleParser {
    protected data: any;

    public setData(data: any) {
        console.log(data);
        
        this.data = data;
        return this;

    }


    abstract parserArticle(): Article;
}
