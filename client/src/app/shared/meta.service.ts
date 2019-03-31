import {Injectable} from '@angular/core';
import {Meta, Title,MetaDefinition} from '@angular/platform-browser';
import Article from "../../../../model/Article";

@Injectable({
    providedIn: 'root'
})
export class MetaService {

    constructor(private titleService: Title, private meta: Meta) {
    }

    updateMeta(article: Article) {
        this.titleService.setTitle(article.header)
        this.meta.addTags([
            {name: 'description', content: article.header},
            {name: 'site_name', content: "Báo hiếu"},
            {name: 'og:type', content: "article"},
            {name: 'og:title', content: article.header},
            {name: 'og:description', content: article.header},
            {name: 'og:image', content: article.images[0]},
            {name: 'og:image:width', content: "2048"},
            {name: 'og:image:height', content: "1268"}

        ], true);


    }
}
