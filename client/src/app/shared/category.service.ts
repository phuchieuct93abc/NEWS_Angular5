import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import CategoryHelper, {Category} from "../../../../model/Categories";

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    private updateCategory = new Subject<Category>();

    constructor() {
    }

    setSelectedCategory(category: string) {
        this.updateCategory.next(CategoryHelper.findByName(category))
    }

    onUpdateCategory() {
        return this.updateCategory;
    }
}
