
export abstract class BodyElementParser<T>{
    constructor(protected body: T){}
    abstract parser():string;
}