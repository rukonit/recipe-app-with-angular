import { Component} from "@angular/core";
import { DataStorageService } from "../shared/data-storage.service";

@Component(
    {
        selector: 'app-header',
        templateUrl: './header.component.html'
    }
)
export class HeaderComponent {
    constructor(private dataStoreService: DataStorageService) {}
    collapsed = true;
    toggleCollapsed() {
       this.collapsed = !this.collapsed;
     }
    onSaveRecipe() {
        this.dataStoreService.storeRecipe()
    }

    onFetchRecipe() {
        this.dataStoreService.fetchRecipe().subscribe();
    }
  
}