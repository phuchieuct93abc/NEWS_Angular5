import Article from "../../../model/Article";

export abstract class ArticleParser<T> {
    protected data: T;

    public setData(data: T) {
       
        this.data = data;
        return this;

    }


    abstract parserArticle(): Article;
}
