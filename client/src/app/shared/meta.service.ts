import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';
import Article from "../../../../model/Article";

@Injectable({
    providedIn: 'root'
})
export class MetaService {

    constructor(private titleService: Title, private meta: Meta) {
    }

    updateMeta(article: Article) {
        this.titleService.setTitle(article.header);
        this.meta.updateTag(
            {name: 'description', content: article.description},
        );
        this.meta.updateTag(
            {name: 'site_name', content: "Báo hiếu"},
        );
        this.meta.updateTag(
            {name: 'og:type', content: "article"},
        );
        this.meta.updateTag(
            {name: 'og:title', content: article.header},
        );
        this.meta.updateTag(
            {name: 'og:description', content: article.description},
        );
        
        this.meta.updateTag(
            {name: 'og:image', content: article.images[1] ||  article.images[0]},
        );
        this.meta.updateTag(
            {name: 'og:image:width', content: "2048"},
        );
        this.meta.updateTag(
            {name: 'og:image:height', content: "1268"}
        );


    }
}
