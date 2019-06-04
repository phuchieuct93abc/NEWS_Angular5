import { Component, OnInit } from '@angular/core';
import CategoryHelper, {Category} from "../../../../model/Categories";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public vietnameseCategories: Category[];

  constructor() {
  }

  ngOnInit() {
    this.vietnameseCategories = CategoryHelper.vietnameseCategories();
    console.log(this.vietnameseCategories)
  }

}
