import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable} from 'rxjs';
import { Ingredient } from '../shared/ingredients.model';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions'

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Observable<{ingredients : Ingredient[]}> ;



  constructor(
    private store: Store<fromApp.AppState>
    ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
     // this.ingredients = this.shoppingListService.getIngredients();
    // this.subShoppingListCh = this.shoppingListService.ingredientChanged.subscribe(
    //   ()=>{this.ingredients = this.shoppingListService.getIngredients()})
    
  }

  //destroy subscription via unsubscribe
  ngOnDestroy() {
    // this.subShoppingListCh.unsubscribe();
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index))
    // this.shoppingListService.startedEditing.next(index);
  }
}
